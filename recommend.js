import { RECIPE_DATABASE } from './data/recipes.js';
// 현재 내 냉장고에 뭐가 있는지 확인해보자
export const getRecommendedRecipes = (myIngredients) => {
    console.log("냉장고 확인:", myIngredients);

    const result = [];

    // 모든 래시피를 하나씩 확인해보자
    for (let i = 0; i < RECIPE_DATABASE.length; i++) {
        result.push(RECIPE_DATABASE[i]);
    }

    return result;
};