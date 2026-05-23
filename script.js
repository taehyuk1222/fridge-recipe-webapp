document.addEventListener('DOMContentLoaded', () => {
    // 식재료 목록 초기화 (localStorage에서 불러오거나 빈 배열 사용)
    let ingredients = JSON.parse(localStorage.getItem('fridge_ingredients'));
    
    // 만약 한 번도 저장된 적 없다면 빈 배열로 시작
    if (!ingredients) {
        ingredients = [];
    }

    const inventoryList = document.querySelector('.inventory-tags');

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
            
            tag.innerHTML = `
                <span class="inv-name">${item.name}</span>
                <span class="inv-qty">${item.quantity}</span>
                <span class="inv-expiry">${item.expiry}</span>
            `;
            inventoryList.appendChild(tag);
        });
    }

    // 초기 화면 렌더링
    renderInventory();

    // 식재료 추가 버튼 클릭 이벤트
    const addBtn = document.getElementById('add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const nameInput = document.getElementById('name');
            const qtyInput = document.getElementById('quantity');
            const expiryInput = document.getElementById('expiry');

            const name = nameInput.value.trim();
            const quantity = qtyInput.value.trim();
            const expiry = expiryInput.value.trim();

            // 입력 검증
            if (!name || !quantity || !expiry) {
                alert('식재료명, 수량, 유통기한을 모두 입력해주세요.');
                return;
            }
            
            // 새로운 식재료 객체 생성
            const newItem = {
                id: Date.now().toString(),
                name: name,
                quantity: quantity,
                expiry: expiry
            };

            // 배열에 추가
            ingredients.push(newItem);

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
