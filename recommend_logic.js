import { RECIPE_DATABASE } from './data/recipes.js';

/**
 보유 재료를 기반으로 레시피 매칭 점수를 계산해보자
 @param {string[]} myIngredients - 현재 내가 가진 재료 목록
 @returns {Object[]} 매칭 점수가 포함된 레시피 목록
 
export const getRecommendedRecipes = (myIngredients) => {
    console.log("추천 알고리즘 시작. 보유 재료:", myIngredients);

    // 전체 레시피를 분석하여 매칭 점수를 계산해보자
    const recommendedRecipes = RECIPE_DATABASE.map(recipe => {
        
        // 레시피 재료 중 내가 가진 재료가 몇 개인지 세어보자
        const matchCount = recipe.ingredients.filter(ing => 
            myIngredients.includes(ing)
        ).length;

        // 전체 필요 재료 대비 매칭 점수 계산해보자 (0으로 나누기 방지)
        const totalNeeded = recipe.ingredients.length;
        const matchScore = totalNeeded > 0 ? (matchCount / totalNeeded) * 100 : 0;

        // 레시피 재료 중 보유한 재료의 개수와 일치율 레시피 정보에 합쳐보자
        return {
            ...recipe,
            matchCount: matchCount,
            matchScore: matchScore.toFixed(1) + '%'
        };
    });

    return recommendedRecipes;
};