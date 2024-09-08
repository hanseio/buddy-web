document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chatMessages');
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');

    function addMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', isUser ? 'user-message' : 'friend-message');
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function handleUserInput() {
        const message = userInput.value.trim();
        if (message) {
            addMessage(message, true);
            userInput.value = '';
            // 여기서 AI 응답을 요청하는 함수를 호출할 예정입니다.
            requestAIResponse(message);
        }
    }

    sendButton.addEventListener('click', handleUserInput);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleUserInput();
        }
    });

    // AI 응답 요청 함수 (아직 구현되지 않음)
    function requestAIResponse(userMessage) {
        fetch('/get_ai_response', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            addMessage(data.response, false);
        })
        .catch(error => {
            console.error('AI 응답 오류:', error);
            addMessage('죄송합니다. 응답을 생성하는 데 문제가 발생했습니다.', false);
        });
    }

    const logoutButton = document.getElementById('logoutButton');
    
    logoutButton.addEventListener('click', () => {
        fetch('/logout', {
            method: 'POST',
            credentials: 'include'
        })
        .then(response => {
            if (response.ok) {
                return response.json(); // JSON 응답을 파싱합니다.
            } else {
                throw new Error('로그아웃 실패');
            }
        })
        .then(data => {
            alert(data.message); // 서버에서 보낸 메시지를 알림으로 표시합니다.
            window.location.href = '/login'; // 로그인 페이지로 리다이렉트합니다.
        })
        .catch(error => {
            console.error('로그아웃 오류:', error);
            alert('로그아웃 처리 중 오류가 발생했습니다.');
        });
    });

    // 새로운 코드 추가
    $(document).ready(function() {
        $('#chat-form').submit(function(e) {
            e.preventDefault();
            var userMessage = $('#user-input').val();
            if (userMessage.trim() === '') return;

            // 사용자 메시지를 채팅창에 추가
            $('#chat-messages').append('<div class="message user-message"><p>' + userMessage + '</p></div>');
            $('#user-input').val('');

            // 스크롤을 최하단으로 이동
            $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);

            // AI 응답 대기 중 메시지 표시
            var waitingMessage = $('<div class="message ai-message"><p>AI가 응답하는 중...</p></div>');
            $('#chat-messages').append(waitingMessage);

            // 서버에 메시지 전송 및 응답 수신
            $.ajax({
                url: '/get_ai_response',
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    message: userMessage,
                    use_language_detection: true  // 언어 감지 기능 사용
                }),
                success: function(response) {
                    // 대기 중 메시지 제거
                    waitingMessage.remove();

                    // AI 응답을 채팅창에 추가
                    $('#chat-messages').append('<div class="message ai-message"><p>' + response.response + '</p></div>');

                    // 스크롤을 최하단으로 이동
                    $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
                },
                error: function() {
                    // 대기 중 메시지 제거
                    waitingMessage.remove();

                    // 오류 메시지 표시
                    $('#chat-messages').append('<div class="message ai-message error"><p>죄송합니다. 응답을 생성하는 데 문제가 발생했습니다.</p></div>');

                    // 스크롤을 최하단으로 이동
                    $('#chat-messages').scrollTop($('#chat-messages')[0].scrollHeight);
                }
            });
        });
    });
});