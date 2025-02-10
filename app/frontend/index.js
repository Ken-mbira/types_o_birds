let submitButton = document.getElementById('submit-button');
if (submitButton) {
    submitButton.disabled = true;
}

const answerBox = document.getElementById('answer-box');
const problemBox = document.getElementById('problem-box');

hideBoxes();

function showAnswer(answer, probability) {
    if (answerBox) {
        answerBox.style.display = 'block';
        let answerText = document.getElementById('answer');
        let probabilityText = document.getElementById('probability');

        answerText.innerText = answer;
        probabilityText.innerText = `Probability: ${probability}`;

        if (submitButton) {
            submitButton.disabled = true;
        }
    }
}

function showProblem(problemText) {
    if (problemBox) {
        problemBox.style.display = 'block';
        let problemTextElement = document.getElementById('problem-text');

        problemTextElement.innerText = problemText;

        if (submitButton) {
            submitButton.disabled = true;
        }
    }
}

function hideBoxes() {
    if (answerBox) {
        answerBox.style.display = 'none';
    }

    if (problemBox) {
        problemBox.style.display = 'none';
    }
}


document.getElementById('image-input').addEventListener('input', () => {
    if (submitButton) {
        submitButton.disabled = false;
    }
    
    const imageForm = document.forms['image-form'];
    const imageFile = imageForm['image-input'].files[0];

    const fReader = new FileReader()
    fReader.readAsDataURL(imageFile);

    fReader.addEventListener('load', () => {
        const imagePreview = document.getElementById('image-preview');
        imagePreview.style.display = 'block'
        imagePreview.src = fReader.result;
    })
});

document.getElementById('image-form').addEventListener('submit', el => {
    el.preventDefault();

    const imageForm = document.forms['image-form'];

    const imageFile = imageForm['image-input'].files[0];

    let formData = new FormData();
    formData.append('file', imageFile);

    const request = new Request(
        "http://localhost:5000/post-image", {
            method: "POST",
            body: formData
        },
    );

    // handle submission
    fetch(request)
        .then(response => {
            if(response.status === 200) {
                return response.json();
            } else {
                // handle when there was a problem
                return response.json()
                    .then(serverError => {
                        throw new Error(`Problem processing image: ${serverError['error']}`)
                    })
            }
        })
        .then((response) => {
            showAnswer(response['result'], response['probability']);
        })
        .catch(err => {
            showProblem(err);
        })
        .finally(() => {
            prepForReset();
        })
})

function prepForReset() {
    let successResetButton = document.getElementById('reset-from-success');

    if(successResetButton) {
        successResetButton.addEventListener('click', () => {
            hideBoxes();

            const imagePreview = document.getElementById('image-preview');
            imagePreview.style.display = 'none';
            imagePreview.src = null;

            submitButton.disabled = false;
        })
    }

    let failureResetButton = document.getElementById('reset-from-failure');

    if(failureResetButton) {
        failureResetButton.addEventListener('click', () => {
            hideBoxes();

            const imagePreview = document.getElementById('image-preview');
            imagePreview.style.display = 'none';

            submitButton.disabled = false;
        })
    }
}