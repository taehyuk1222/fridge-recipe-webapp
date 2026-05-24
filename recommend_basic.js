import { getRecommendedRecipes } from './recommend_logic.js';
import { sortRecipesByMode } from './recommend_sort.js';


const RecommendedRecipeList = ({ myIngredients, sortMode }) => {

    const recommended = getRecommendedRecipes(myIngredients);


    const sortedRecipes = sortRecipesByMode(recommended, sortMode);


    return (
        <div>
            {sortedRecipes.map((recipe) => (
                <div key={recipe.id} className="recipe-card">
                    <h3>{recipe.name}</h3>
                    <p>매칭 점수: {recipe.matchScore}</p>

                    {/* 부족 재료(needed) 표시 */}
                    <p>부족한 재료: {recipe.missingIngredients.length > 0
                        ? recipe.missingIngredients.join(', ')
                        : '없음'}</p>
                </div>
            ))}
        </div>
    );
};