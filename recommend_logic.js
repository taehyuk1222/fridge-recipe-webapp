const getRecommendedRecipes = (validIngredients) => {
    if (!Array.isArray(validIngredients)) {
        console.error("재료 목록이 올바르지 않아요!");
        return [];
    }

    const myNames = validIngredients.map(i => i.name.trim());

    // 레시피 데이터베이스를 하나씩 꺼내서 분석
    return RECIPE_DATABASE.map(recipe => {
        const ingredientsInRecipe = recipe.ingredients || [];
        const neededInRecipe = recipe.needed || [];

        // 내 재료 중 레시피에 속하는 객체들
        const matchedObjects = validIngredients.filter(ing => 
            ingredientsInRecipe.includes(ing.name.trim()) || neededInRecipe.includes(ing.name.trim())
        );

        const matchedNames = matchedObjects.map(ing => ing.name.trim());

        // 내 재료와 레시피 핵심 재료(ingredients) 비교해서 일치하는 것만 추출
        const matchedCoreNames = ingredientsInRecipe.filter(ing => matchedNames.includes(ing.trim()));

        // 추가 구매가 필요한 재료 추출 (needed 중 내가 안 가진 것)
        const missing = neededInRecipe.filter(ing => !myNames.includes(ing.trim()));

        // 내가 없는 재료 중 ingredients 항목 (핵심 재료지만 없는 것)
        const missingCore = ingredientsInRecipe.filter(ing => !myNames.includes(ing.trim()));

        const allMissing = [...missingCore, ...missing];

        // 추천 점수는 보유 재료 일치도, 우선소비 재료 포함 여부, 부족 재료 개수를 기준으로 계산한다
        // 추천 후보 조건을 통과한 레시피는 기본 50점을 부여하고, 최대 100점으로 제한한다

        // 1. 기본 적합도 점수 (기본 50점)
        let baseScore = 50;

        // 2. 보유 재료 일치도 (최대 25점)
        let matchRatioScore = 0;
        if (ingredientsInRecipe.length > 0) {
            matchRatioScore = (matchedCoreNames.length / ingredientsInRecipe.length) * 25;
        }

        // 3. 우선소비 재료 가중치 (최대 15점)
        let todayCount = 0;
        let urgentCount = 0;
        let maxWeightReason = null;
        let priorityScore = 0;

        matchedObjects.forEach(ing => {
            if (ing.diffDays === 0) {
                priorityScore += 15;
                todayCount++;
                if (!maxWeightReason) maxWeightReason = ing.name;
            } else if (ing.diffDays === 1) {
                priorityScore += 12;
                urgentCount++;
                if (!maxWeightReason && todayCount === 0) maxWeightReason = ing.name;
            } else if (ing.diffDays === 2) {
                priorityScore += 10;
                urgentCount++;
                if (!maxWeightReason && todayCount === 0) maxWeightReason = ing.name;
            } else if (ing.diffDays === 3) {
                priorityScore += 8;
                urgentCount++;
                if (!maxWeightReason && todayCount === 0) maxWeightReason = ing.name;
            }
        });
        priorityScore = Math.min(15, priorityScore);

        // 4. 부족 재료 개수 점수 (최대 10점)
        let missingScore = 0;
        if (allMissing.length === 0) missingScore = 10;
        else if (allMissing.length === 1) missingScore = 8;
        else if (allMissing.length === 2) missingScore = 5;
        else if (allMissing.length === 3) missingScore = 2;
        else missingScore = 0;

        // 5. 최종 점수 처리
        let finalScore = baseScore + matchRatioScore + priorityScore + missingScore;
        finalScore = Math.max(50, Math.min(100, Math.round(finalScore)));

        // 추천 이유 생성 로직 (담백하게)
        let reason = "";
        if (todayCount > 0 || urgentCount > 0) {
            reason = `유통기한이 가까운 ${maxWeightReason}을(를) 활용할 수 있어 우선소비에 적합한 메뉴입니다.`;
            if (allMissing.length > 0) {
                reason = `유통기한이 가까운 ${maxWeightReason}을(를) 활용할 수 있고, 추가 재료 ${allMissing.length}가지만 준비하면 만들 수 있습니다.`;
            }
        } else {
            const ingText = matchedNames.length > 1 ? `${matchedNames[0]}와(과) ${matchedNames[1]}` : matchedNames[0];
            if (allMissing.length === 0) {
                reason = `보유 중인 ${ingText}을(를) 활용할 수 있고, 추가 재료 없이 바로 요리할 수 있습니다.`;
            } else {
                reason = `보유 중인 ${ingText}을(를) 활용할 수 있고, 추가 재료 ${allMissing.length}가지만 준비하면 만들 수 있습니다.`;
            }
        }

        return {
            ...recipe,
            matchedIngredients: matchedNames,
            missingIngredients: allMissing,
            needsMore: allMissing.length > 0,
            matchScoreValue: finalScore,
            matchScore: finalScore,
            reason: reason,
            hasPriority: todayCount > 0 || urgentCount > 0
        };
    }).filter(recipe => recipe.matchedIngredients.length > 0 && recipe.missingIngredients.length <= 3); 
};