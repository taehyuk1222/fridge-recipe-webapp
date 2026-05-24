
const DIFFICULTY_ORDER = { '쉬움': 1, '보통': 2, '어려움': 3 };

const SORT_STRATEGIES = {

    DEFAULT: (a, b) => {
        const scoreDiff = parseFloat(b.matchScore) - parseFloat(a.matchScore);
        if (scoreDiff !== 0) return scoreDiff;

        const diffA = DIFFICULTY_ORDER[a.difficulty] || 99;
        const diffB = DIFFICULTY_ORDER[b.difficulty] || 99;
        if (diffA !== diffB) return diffA - diffB;

        return (parseInt(a.cookingTime) || 999) - (parseInt(b.cookingTime) || 999);
    },
    // [상황: 귀찮음] 일치율 -> 난이도(쉬운 것부터)
    EASY_MODE: (a, b) => {
        const scoreDiff = parseFloat(b.matchScore) - parseFloat(a.matchScore);
        if (scoreDiff !== 0) return scoreDiff;
        return (DIFFICULTY_ORDER[a.difficulty] || 99) - (DIFFICULTY_ORDER[b.difficulty] || 99);
    },
    // [상황: 바쁨] 일치율 -> 조리시간(짧은 것부터)
    QUICK_MODE: (a, b) => {
        const scoreDiff = parseFloat(b.matchScore) - parseFloat(a.matchScore);
        if (scoreDiff !== 0) return scoreDiff;
        return (parseInt(a.cookingTime) || 999) - (parseInt(b.cookingTime) || 999);
    },
    // [상황: 다이어트] 일치율 -> 칼로리(낮은 것부터)
    DIET_MODE: (a, b) => {
        const scoreDiff = parseFloat(b.matchScore) - parseFloat(a.matchScore);
        if (scoreDiff !== 0) return scoreDiff;
        return (parseInt(a.calories) || 9999) - (parseInt(b.calories) || 9999);
    }
};

/**
 * 정렬 실행 함수
 * @param {Array} recipes - 레시피 목록
 * @param {String} mode - 정렬 모드 ('DEFAULT' | 'EASY_MODE' | 'QUICK_MODE' | 'DIET_MODE')
 */
export const getSortedRecipes = (recipes, mode = 'DEFAULT') => {
    if (!Array.isArray(recipes)) return [];

    // 선택된 전략이 없을 경우 안전하게 DEFAULT 반환
    const strategy = SORT_STRATEGIES[mode] || SORT_STRATEGIES.DEFAULT;

    // 데이터 불변성 유지를 위해 복사본 정렬
    return [...recipes].filter(recipe => recipe).sort(strategy);
};