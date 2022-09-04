//
export class Api {
    constructor({adress}) {
        this._adress = adress;
    }

    getFullPageInfo() {
        return Promise.all([this.getInitialCards(), this.getUserData()])
    }

    getInitialCards() {
        return fetch(`${this._adress}/cards`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(this._checkResponse)
    }
    
    getUserData() {
        return fetch(`${this._adress}/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(this._checkResponse)
    }

    setUserData(data) {
        return fetch(`${this._adress}/users/me`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: data.name,
                about: data.about
            })
        })
        .then(this._checkResponse)
    }

    setUserAvatar({avatar}) {
        //console.log('!!!', avatar);
        return fetch(`${this._adress}/users/me/avatar`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                avatar: avatar
            })
        })
        .then(this._checkResponse)
    }

    // добавление новой карточки
    setMyCard(data) {
        return fetch(`${this._adress}/cards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                name: data.name,
                link: data.link
            }),
        })
        .then(this._checkResponse)
    }

    // удаление карточки 
    deleteCard(id) {
        return fetch(`${this._adress}/cards/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(this._checkResponse)
    }

    // лайки.постановка/удаление
    сhangeLikeCard(card, like) {
        return fetch(`${this._adress}/cards/${card._id}/likes`, {
            method: like ? 'DELETE' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(this._checkResponse)
    }

    //метод проверки ответа от сервера
    _checkResponse(response) {
        // тут проверка ответа
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(`Ошибка ${response.status}`);
    }

    getCrash() {
        return fetch(`${this._adress}/crash-test`, {
            method: "GET",
        })
        .then(this._checkResponse);
    }
}

const api = new Api({
    adress: 'https://from-react-mesto-api-full-b.vercel.app',
    //token : '86724e9f-206a-43a9-ab92-a5e8d301d078'
})

export default api;