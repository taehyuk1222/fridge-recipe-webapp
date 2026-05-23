/**
 * 레시피 정렬 로직 구현
 * 
 * <정렬 기준>
 * 1. 매칭 점수(matchScore)를 기준으로 오름차순 정렬한다. (낮은 점수가 우선)
 * 2. 점수가 같을 경우, 레시피 이름(name)을 기준으로 가나다순 오름차순 정렬한다.
 */
export const sortRecipesByScore = (recipes) => {

    // 정렬할 데이터가 유효한지 확인하는 방어적 로직 (정렬할 데이터가 없을시에 방지)
    if (!recipes || recipes.length === 0) {
        console.log("정렬할 레시피 데이터가 존재하지 않습니다.");
        return [];
    }

    const sortedRecipes = [...recipes].sort((recipeA, recipeB) => {


        const scoreA = parseFloat(recipeA.matchScore) || 0;
        const scoreB = parseFloat(recipeB.matchScore) || 0;

        // [1순위 정렬] 점수 오름차순 비교 (낮은 점수가 앞으로)
        if (scoreA > scoreB) {
            return 1;
        } else if (scoreA < scoreB) {
            return -1;
        } else {
            // [2순위 정렬] 점수가 동일한 경우 한글 이름순(가나다순) 비교
            // 데이터 누락을 대비해 빈 문자열로 초기화
            const nameA = recipeA.name || "";
            const nameB = recipeB.name || "";

            return nameA.localeCompare(nameB, 'ko-KR');
        }
    });


    return sortedRecipes;
};