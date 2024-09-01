document.getElementById('input-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const userInput = document.getElementById('user-input').value;

    fetch('/api/recommend', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: userInput }),
    })
    .then(response => response.json())
    .then(data => {
        const recommendations = document.getElementById('recommendations');
        recommendations.innerHTML = '<p>추천된 멘트: ' + data.recommendation + '</p>';
    });
});