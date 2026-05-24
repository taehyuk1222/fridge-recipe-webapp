import { RECIPE_DATABASE } from './data/recipes.js';

export const getRecommendedRecipes = (myIngredients) => {
    //  
    if (!Array.isArray(myIngredients)) {
        console.error("재료 목록이 올바르지 않아요!");
        return [];
    }

    // 레시피 데이터베이스를 하나씩 꺼내서 분석
    return RECIPE_DATABASE.map(recipe => {

        //
        const ingredientsInRecipe = recipe.ingredients || [];

        // 내 재료와 레시피 재료를 비교해서 일치하는 것만 추출
        const matched = ingredientsInRecipe.filter(ing =>
            myIngredients.map(i => i.trim()).includes(ing.trim())
        );

        // 내가 없는 재료(부족한 재료)가 무엇인지도 찾아 추출
        const missing = ingredientsInRecipe.filter(ing =>
            !myIngredients.map(i => i.trim()).includes(ing.trim())
        );

        // 재료 기반 레시피 충족도 계산 
        const matchCount = matched.length;
        const totalNeeded = ingredientsInRecipe.length;
        let matchScore = 0;
        if (totalNeeded > 0) {
            matchScore = (matchCount / totalNeeded) * 100;
        }

        // 
        return {
            ...recipe,
            matchCount: matchCount,
            matchScore: matchScore.toFixed(1) + '%',
            missingIngredients: missing,
            needsMore: missing.length > 0
        };
    });
};