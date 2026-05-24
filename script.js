document.addEventListener('DOMContentLoaded', () => {
    // 식재료 목록 초기화 (localStorage에서 불러오거나 빈 배열 사용)
    let ingredients = JSON.parse(localStorage.getItem('fridge_ingredients'));
    
    // 만약 한 번도 저장된 적 없다면 빈 배열로 시작
    if (!ingredients) {
        ingredients = [];
    }

    let editingId = null; // 현재 수정 중인 항목의 ID

    const inventoryList = document.querySelector('.inventory-tags');
    const priorityListUl = document.querySelector('.priority-list');
    const recipeGrid = document.getElementById('recipe-grid');
    const nameInput = document.getElementById('name');
    const qtyInput = document.getElementById('quantity');
    const expiryInput = document.getElementById('expiry');
    const addBtn = document.getElementById('add-btn');

    // 모달 요소
    const modal = document.getElementById('recipe-modal');
    const modalClose = document.getElementById('modal-close');

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    // 바깥 영역 클릭 시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });

    // D-day 계산 함수
    function calculateDDay(expiryString) {
        if (!expiryString) return { label: '', statusClass: '', diffDays: 999 };
        
        const expiryDate = new Date(expiryString);
        const today = new Date();
        
        // 시간은 0으로 초기화해서 날짜만 비교
        expiryDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0) {
            return { label: '기한 만료', statusClass: 'badge-expired', diffDays };
        } else if (diffDays === 0) {
            return { label: '오늘까지', statusClass: 'badge-today', diffDays };
        } else if (diffDays <= 3) {
            return { label: `D-${diffDays}`, statusClass: 'badge-warning', diffDays };
        } else {
            return { label: `D-${diffDays}`, statusClass: 'badge-safe', diffDays };
        }
    }

    // 우선소비 식재료 렌더링 함수
    function renderPriorityList() {
        if (!priorityListUl) return;

        priorityListUl.innerHTML = ''; // 기존 목록 초기화

        // 우선소비 대상 선별 (D-3 이하) 및 정렬 (기한 임박순)
        const priorityItems = ingredients
            .map(item => ({ ...item, dDayInfo: calculateDDay(item.expiry) }))
            .filter(item => item.dDayInfo.diffDays <= 3)
            .sort((a, b) => a.dDayInfo.diffDays - b.dDayInfo.diffDays);

        if (priorityItems.length === 0) {
            // 빈 상태 처리
            const emptyLi = document.createElement('li');
            emptyLi.className = 'priority-item';
            emptyLi.innerHTML = `
                <div class="p-info" style="width: 100%; justify-content: center;">
                    <span style="color: var(--text-light); font-size: 0.9rem;">현재 급하게 소비할 식재료가 없습니다.</span>
                </div>
            `;
            priorityListUl.appendChild(emptyLi);
            return;
        }

        // 우선소비 식재료 출력
        priorityItems.forEach(item => {
            const li = document.createElement('li');
            li.className = 'priority-item';
            
            li.innerHTML = `
                <div class="p-info">
                    <span class="p-name">${item.name}</span>
                    <span class="p-qty">${item.quantity}</span>
                    <span class="inv-expiry" style="margin-left: 8px;">${item.expiry}</span>
                </div>
                <span class="badge ${item.dDayInfo.statusClass}">${item.dDayInfo.label}</span>
            `;
            priorityListUl.appendChild(li);
        });
    }

    // 식재료 목록 렌더링 함수
    function renderInventory() {
        if (!inventoryList) return;
        
        inventoryList.innerHTML = ''; // 기존 목록 초기화

        if (ingredients.length === 0) {
            // 등록된 식재료가 없을 경우
            const emptyTag = document.createElement('div');
            emptyTag.className = 'inv-tag empty-tag';
            emptyTag.innerHTML = '<span>+ 추가 식재료 없음</span>';
            inventoryList.appendChild(emptyTag);
            return;
        }

        // 등록된 식재료 출력
        ingredients.forEach(item => {
            const tag = document.createElement('div');
            tag.className = 'inv-tag';
            if (item.id === editingId) {
                tag.classList.add('editing');
            }
            
            const dDayInfo = calculateDDay(item.expiry);
            
            tag.innerHTML = `
                <span class="inv-name">${item.name}</span>
                <span class="inv-qty">${item.quantity}</span>
                <span class="inv-expiry">${item.expiry}</span>
                <span class="badge ${dDayInfo.statusClass}">${dDayInfo.label}</span>
                <div class="inv-actions">
                    <button class="inv-btn inv-btn-edit" title="수정">&#9998;</button>
                    <button class="inv-btn inv-btn-delete" title="삭제">&#10005;</button>
                </div>
            `;

            // 수정 버튼 이벤트
            const editBtn = tag.querySelector('.inv-btn-edit');
            editBtn.addEventListener('click', () => {
                nameInput.value = item.name;
                qtyInput.value = item.quantity;
                expiryInput.value = item.expiry;
                
                editingId = item.id;
                if (addBtn) addBtn.textContent = '수정 완료';
                
                renderAll();
            });

            // 삭제 버튼 이벤트
            const deleteBtn = tag.querySelector('.inv-btn-delete');
            deleteBtn.addEventListener('click', () => {
                if (confirm('이 식재료를 삭제하시겠습니까?')) {
                    ingredients = ingredients.filter(i => i.id !== item.id);
                    localStorage.setItem('fridge_ingredients', JSON.stringify(ingredients));
                    
                    if (editingId === item.id) {
                        editingId = null;
                        nameInput.value = '';
                        qtyInput.value = '';
                        expiryInput.value = '';
                        if (addBtn) addBtn.textContent = '등록하기';
                    }
                    
                    renderAll();
                }
            });

            inventoryList.appendChild(tag);
        });
    }

    // 추천 레시피 렌더링 로직
    function renderRecipes() {
        if (!recipeGrid) return;

        // 보유 재료 추출 (기한 만료 제외)
        const validIngredients = ingredients
            .map(item => ({ name: item.name, diffDays: calculateDDay(item.expiry).diffDays }))
            .filter(item => item.diffDays >= 0);

        if (validIngredients.length === 0) {
            recipeGrid.innerHTML = `
                <div style="text-align:center; padding: 40px; color: var(--text-light); width: 100%;">
                    사용 가능한 식재료를 등록하면 맞춤 레시피를 추천해드려요!
                </div>
            `;
            return;
        }

        // 추천 로직 실행 (전역 함수 사용)
        const recommended = getRecommendedRecipes(validIngredients);
        const sorted = getSortedRecipes(recommended, 'DEFAULT');
        const topRecipes = sorted.slice(0, 6); // 상위 6개 노출

        if (topRecipes.length === 0) {
            recipeGrid.innerHTML = `
                <div style="text-align:center; padding: 40px; color: var(--text-light); width: 100%; grid-column: 1 / -1;">
                    현재 보유 재료로 추천 가능한 레시피가 없습니다.
                </div>
            `;
            return;
        }

        recipeGrid.innerHTML = '';
        topRecipes.forEach(recipe => {
            const card = document.createElement('div');
            card.className = 'recipe-card-rich';
            
            const haveChips = recipe.matchedIngredients.map(ing => `<span class="chip chip-have">${ing}</span>`).join('');
            
            let missBox = '';
            if (recipe.needsMore) {
                const missChips = recipe.missingIngredients.map(ing => `<span class="chip chip-miss">${ing}</span>`).join('');
                missBox = `
                    <div class="rc-ingredient-box split-miss">
                        <div class="box-title miss-title">추가 구매 필요</div>
                        <div class="ingredient-chips">${missChips}</div>
                    </div>
                `;
            } else {
                missBox = `
                    <div class="rc-ingredient-box split-have" style="background: var(--color-bg-mint-tint); border: 1px solid var(--color-light-mint);">
                        <div class="box-title have-title" style="color: var(--color-deep-green); text-align: center; width: 100%;">추가 구매 없이 바로 조리 가능</div>
                    </div>
                `;
            }

            let statusBadge = '';
            if (recipe.hasPriority) {
                statusBadge = `<span class="badge badge-warning">우선소비 추천</span>`;
            } else if (recipe.needsMore) {
                statusBadge = `<span class="badge badge-safe">추가 재료 필요</span>`;
            } else {
                statusBadge = `<span class="badge badge-today">바로 요리 가능</span>`;
            }

            card.innerHTML = `
                <div class="rc-header">
                    <span class="badge badge-safe">${recipe.category}</span>
                    <h3 class="rc-title">${recipe.name}</h3>
                </div>
                <div class="rc-body">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                        <span class="badge ${recipe.needsMore ? 'badge-safe' : 'badge-today'}">${recipe.needsMore ? '추가 재료 필요' : '바로 요리 가능'}</span>
                        <span style="font-weight: 600; color: var(--color-mint-text);">추천 점수: ${Math.round(recipe.matchScoreValue)}점</span>
                    </div>
                    <p style="color: var(--text-body); font-size: 0.85rem; font-weight: 500; margin-bottom: 12px;">${recipe.reason}</p>
                    <div class="rc-ingredients">
                        <div class="rc-ingredient-box split-have">
                            <div class="box-title have-title">보유 중인 재료</div>
                            <div class="ingredient-chips">${haveChips}</div>
                        </div>
                        ${missBox}
                    </div>
                </div>
                <div class="rc-footer">
                    <button class="btn-text recipe-btn">레시피 상세보기 <span class="arrow">&rarr;</span></button>
                </div>
            `;

            // 상세보기 클릭 시 모달 오픈
            const btn = card.querySelector('.recipe-btn');
            btn.addEventListener('click', () => {
                document.getElementById('modal-category').textContent = recipe.category;
                document.getElementById('modal-title').textContent = recipe.name;
                document.getElementById('modal-reason').textContent = recipe.reason;
                document.getElementById('modal-time').textContent = recipe.cookingTime;
                document.getElementById('modal-difficulty').textContent = recipe.difficulty;
                document.getElementById('modal-calories').textContent = recipe.calories;
                
                const scoreElem = document.getElementById('modal-score');
                if (scoreElem) scoreElem.textContent = Math.round(recipe.matchScoreValue) + '점';

                document.getElementById('modal-have-ingredients').innerHTML = haveChips;
                document.getElementById('modal-miss-ingredients').innerHTML = recipe.needsMore 
                    ? recipe.missingIngredients.map(ing => `<span class="chip chip-miss">${ing}</span>`).join('') 
                    : '<span class="chip chip-have">모두 보유 중!</span>';

                const stepsElem = document.getElementById('modal-steps-list');
                if (stepsElem) {
                    if (recipe.steps && Array.isArray(recipe.steps)) {
                        stepsElem.innerHTML = recipe.steps.map(step => `<li>${step}</li>`).join('');
                    } else {
                        stepsElem.innerHTML = '<li>등록된 조리 순서가 없습니다.</li>';
                    }
                }

                modal.classList.add('active');
            });

            recipeGrid.appendChild(card);
        });
    }

    // 통합 렌더링 함수
    function renderAll() {
        renderInventory();
        renderPriorityList();
        renderRecipes();
    }

    // 초기 화면 렌더링
    renderAll();

    // 식재료 추가/수정 버튼 클릭 이벤트
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const quantity = qtyInput.value.trim();
            const expiry = expiryInput.value.trim();

            if (!name || !quantity || !expiry) {
                alert('식재료명, 수량, 유통기한을 모두 입력해주세요.');
                return;
            }
            
            if (editingId) {
                const index = ingredients.findIndex(i => i.id === editingId);
                if (index !== -1) {
                    ingredients[index] = { ...ingredients[index], name, quantity, expiry };
                }
                editingId = null;
                addBtn.textContent = '등록하기';
            } else {
                const newItem = {
                    id: Date.now().toString(),
                    name: name,
                    quantity: quantity,
                    expiry: expiry
                };
                ingredients.push(newItem);
            }

            localStorage.setItem('fridge_ingredients', JSON.stringify(ingredients));

            renderAll();
            
            nameInput.value = '';
            qtyInput.value = '';
            expiryInput.value = '';
        });
    }

});
