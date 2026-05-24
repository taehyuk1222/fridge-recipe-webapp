import React from 'react';
import { getRecommendedRecipes } from './recommend_logic.js';
import { sortRecipesByMode } from './recommend_sort.js';

export const RecommendedRecipeList = ({ myIngredients, sortMode }) => {

    const recommended = getRecommendedRecipes(myIngredients);

    const sortedRecipes = sortRecipesByMode(recommended, sortMode);

    if (!sortedRecipes || sortedRecipes.length === 0) {
        return (
            <div className="empty-message">
                <p>현재 보유하신 재료로 만들 수 있는 레시피가 없거나 추천 결과가 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="recipe-list-container">
            {sortedRecipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                    <h3>{recipe.name}</h3>
                    <p>매칭 점수: {recipe.matchScore}</p>

                    {/* 부족 재료 표시 영역 */}
                    <div className="needed-ingredients">
                        <p>
                            부족한 재료: {recipe.missingIngredients.length > 0
                                ? recipe.missingIngredients.join(', ')
                                : '없음 (즉시 조리 가능!)'}
                        </p>
                    </div>

                    {/* 레시피 상세 링크 추가 (데이터에 있는 경우) */}
                    {recipe.recipeUrl && (
                        <a href={recipe.recipeUrl} target="_blank" rel="noopener noreferrer">
                            레시피 보러가기
                        </a>
                    )}
                </div>
            ))}
        </div>
    );
};