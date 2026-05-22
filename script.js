document.addEventListener('DOMContentLoaded', () => {
    // 식재료 추가 버튼 클릭 이벤트
    const addBtn = document.getElementById('add-btn');
    if (addBtn) {
        addBtn.addEventListener('click', () => {
            const name = document.getElementById('name').value;
            const qty = document.getElementById('quantity').value;
            const expiry = document.getElementById('expiry').value;

            if (!name) {
                alert('식재료명을 입력해주세요.');
                return;
            }
            
            alert(`[기능 구현 예정] '${name}' 식재료가 목록에 등록되었습니다.`);
            
            // 입력창 초기화
            document.getElementById('name').value = '';
            document.getElementById('quantity').value = '';
            document.getElementById('expiry').value = '';
        });
    }

    // 레시피 보기 버튼 클릭 이벤트
    const recipeBtns = document.querySelectorAll('.recipe-btn');
    recipeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            alert('[기능 구현 예정] 선택하신 레시피의 상세 과정 페이지로 이동합니다.');
        });
    });
});
