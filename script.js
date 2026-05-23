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
    const nameInput = document.getElementById('name');
    const qtyInput = document.getElementById('quantity');
    const expiryInput = document.getElementById('expiry');
    const addBtn = document.getElementById('add-btn');

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

    // 통합 렌더링 함수
    function renderAll() {
        renderInventory();
        renderPriorityList();
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

    // 레시피 보기 버튼 클릭 이벤트 (기존 유지)
    const recipeBtns = document.querySelectorAll('.recipe-btn');
    recipeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('[기능 구현 예정] 선택하신 레시피의 상세 과정 페이지로 이동합니다.');
        });
    });
});
