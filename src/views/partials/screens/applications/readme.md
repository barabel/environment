# Скрин оставить заявку на яхту

![screen](./applications-example.png?raw=true "Скриншот оставить заявку на яхту")

Пропсы:
- class: string, Дополнительные классы, модификаторы;

Пример данных:
```
{
  "img": {
    "src": "/assets/img/applications/background-d.jpg",
    "alt": "background"
  },
  "heading": {
    "title": "оставить заявку на яхту",
    "description": "Оставить, пожалуйста, Ваши контакты, и мы с свяжемся с Вами"
  },
  "form": {
    "action": "api/popup_success",
    "method": "POST",
    "fields": [
      {
        "placeholder": "ФИО*",
        "type": "text",
        "name": "name",
        "validators": ["required"],
        "error_message": "Заполните поле, чтобы продолжить"
      },
      {
        "placeholder": "Email*",
        "type": "email",
        "name": "email",
        "validators": ["required"],
        "error_message": "Заполните поле, чтобы продолжить"
      },
      {
        "placeholder": "Телефон",
        "type": "phone",
        "name": "phone",
        "validators": ["required"],
        "error_message": "Заполните поле, чтобы продолжить"
      },
      {
        "type": "textarea",
        "name": "message",
        "placeholder": "Сообщение"
      }
    ],
    "btn": {
      "title": "Отправить заявку"
    }
  }
}
```
