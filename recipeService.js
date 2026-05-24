
const getMissing = (recipeIngredients, inventory) => {
    return recipeIngredients.filter(item => !inventory.includes(item));
};

{
    recommendedRecipes.map(recipe => {
        const missing = getMissing(recipe.ingredients, myInventory);
        const hasMissing = missing.length > 0;

        return (
            <div key={recipe.id} className="recipe-card">
                <h3>{recipe.name}</h3>
                {hasMissing ? (
                    <div>
                        <p>부족한 재료: {missing.join(', ')}</p>
                        <button onClick={() => alert('장바구니에 추가되었습니다!')}>
                            재료 구매하기
                        </button>
                    </div>
                ) : (
                    <p>바로 요리 가능합니다!</p>
                )}
            </div>
        );
    })
}