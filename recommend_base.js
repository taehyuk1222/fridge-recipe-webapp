export const getRecommendedRecipes = (myIngredients) => {
    const result = [];

    for (let i = 0; i < RECIPE_DATABASE.length; i++) {
        const recipe = RECIPE_DATABASE[i];
        let matched = 0;

        // 냉장고에 있는 재료와 레시피 재료 하나씩 직접 비교 해서 겹치는 거 찾아보자
        for (let j = 0; j < recipe.ingredients.length; j++) {
            if (myIngredients.includes(recipe.ingredients[j])) {
                matched++;
            }
        }

        // 일치하면 matched 점수 1 증가 아니면 0으로 유지
        result.push({ ...recipe, matched: matched });
    }

    return result;
};