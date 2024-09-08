document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const logoutButton = document.getElementById('logoutButton');

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'friend-message');
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function getFriendResponse(userMessage) {
        // 여기에 AI 로직을 연결하거나 임시 응답을 생성합니다
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(`당신의 메시지 "${userMessage}"에 대한 친구의 대답입니다.`);
            }, 1000); // 1초 후 응답
        });
    }

    sendButton.addEventListener('click', async () => {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';

            // 친구 응답 대기 중 표시
            const typingIndicator = document.createElement('div');
            typingIndicator.classList.add('message', 'friend-message');
            typingIndicator.textContent = '입력 중...';
            chatMessages.appendChild(typingIndicator);

            const response = await getFriendResponse(message);
            
            // 대기 중 메시지 제거
            chatMessages.removeChild(typingIndicator);

            addMessage(response, false);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

    logoutButton.addEventListener('click', () => {
        // 서버에 로그아웃 요청을 보냅니다.
        fetch('/logout', {
            method: 'POST',
            credentials: 'include' // 쿠키를 포함시킵니다.
        })
        .then(response => {
            if (response.ok) {
                // 로컬 스토리지나 세션 스토리지의 사용자 관련 데이터를 삭제합니다.
                localStorage.removeItem('userToken'); // 예시: 저장된 토큰 삭제
                sessionStorage.clear(); // 세션 스토리지 초기화

                // 클라이언트 측 상태 초기화
                // 예: 채팅 기록 삭제, 사용자 정보 초기화 등

                alert('로그아웃되었습니다.');
                window.location.href = '/login'; // 로그인 페이지로 리다이렉트
            } else {
                alert('로그아웃 처리 중 오류가 발생했습니다.');
            }
        })
        .catch(error => {
            console.error('로그아웃 오류:', error);
            alert('로그아웃 처리 중 오류가 발생했습니다.');
        });
    });

    // 초기 메시지 추가
    addMessage('안녕하세요! 무엇을 도와드릴까요?', false);
});