document.addEventListener('DOMContentLoaded', () => {
    // 식재료 목록 초기화 (localStorage에서 불러오거나 빈 배열 사용)
    let ingredients = JSON.parse(localStorage.getItem('fridge_ingredients'));
    
    // 만약 한 번도 저장된 적 없다면 빈 배열로 시작
    if (!ingredients) {
        ingredients = [];
    }

    let editingId = null; // 현재 수정 중인 항목의 ID

    const inventoryList = document.querySelector('.inventory-tags');
    const nameInput = document.getElementById('name');
    const qtyInput = document.getElementById('quantity');
    const expiryInput = document.getElementById('expiry');
    const addBtn = document.getElementById('add-btn');

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
            
            tag.innerHTML = `
                <span class="inv-name">${item.name}</span>
                <span class="inv-qty">${item.quantity}</span>
                <span class="inv-expiry">${item.expiry}</span>
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
                
                renderInventory(); // editing 스타일 적용을 위해 다시 렌더링
            });

            // 삭제 버튼 이벤트
            const deleteBtn = tag.querySelector('.inv-btn-delete');
            deleteBtn.addEventListener('click', () => {
                if (confirm('이 식재료를 삭제하시겠습니까?')) {
                    ingredients = ingredients.filter(i => i.id !== item.id);
                    localStorage.setItem('fridge_ingredients', JSON.stringify(ingredients));
                    
                    // 만약 삭제한 항목이 현재 수정 중인 항목이라면 폼 초기화
                    if (editingId === item.id) {
                        editingId = null;
                        nameInput.value = '';
                        qtyInput.value = '';
                        expiryInput.value = '';
                        if (addBtn) addBtn.textContent = '등록하기';
                    }
                    
                    renderInventory();
                }
            });

            inventoryList.appendChild(tag);
        });
    }

    // 초기 화면 렌더링
    renderInventory();

    // 식재료 추가/수정 버튼 클릭 이벤트
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const name = nameInput.value.trim();
            const quantity = qtyInput.value.trim();
            const expiry = expiryInput.value.trim();

            // 입력 검증
            if (!name || !quantity || !expiry) {
                alert('식재료명, 수량, 유통기한을 모두 입력해주세요.');
                return;
            }
            
            if (editingId) {
                // 수정 모드
                const index = ingredients.findIndex(i => i.id === editingId);
                if (index !== -1) {
                    ingredients[index] = { ...ingredients[index], name, quantity, expiry };
                }
                editingId = null;
                addBtn.textContent = '등록하기';
            } else {
                // 추가 모드
                const newItem = {
                    id: Date.now().toString(),
                    name: name,
                    quantity: quantity,
                    expiry: expiry
                };
                ingredients.push(newItem);
            }

            // localStorage에 저장
            localStorage.setItem('fridge_ingredients', JSON.stringify(ingredients));

            // 화면 다시 그리기
            renderInventory();
            
            // 입력창 초기화
            nameInput.value = '';
            qtyInput.value = '';
            expiryInput.value = '';
        });
    }

    // 레시피 보기 버튼 클릭 이벤트 (기존 유지)
    const recipeBtns = document.querySelectorAll('.recipe-btn');
    recipeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('[기능 구현 예정] 선택하신 레시피의 상세 과정 페이지로 이동합니다.');
        });
    });
});
