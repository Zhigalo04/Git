# ЭВТ

---

Жигало Владислав Андреевич
Гр.210902

---

[Лабораторные работы можно посмотреть по этой ссылке](https://zhigalo04.github.io/Git/)

---

## 📝 Мои контактные данные

- **E-mail:** vladzigalo@gmail.com
- **Telegram:** @NeWhatIsLove
- **Моб. тел.:** +375293160678

## О себе ✒

Студент БГУИРа. Учусь на 3-ем курсе. В планах только развиваться и быть счастливым. Моими сильными сторонами являются: коммуникабельность, честность, отзывчивотсь и усердность. Люблю общаться с людьми разных взглядов и отраслей, т.к. это обогощает мой внутренний мир. Обожаю музыку, причем разных жанров.🎵

## 📜 Навыки

- _Git_
- _MySQL_
- _HTML_
- _CSS_
- _JS_
- _Java_
- Уровень английского пока не знаю, но разговорный неплохой😊

## Опыт

Писал курсовые работы на языках Java, HTML, CSS, JS. Также работал с MySQL.

## Образование🎩

| Год                      | Учебное заведение | Специальность         | Факультет  |
| -------------------------| ------------------| ----------------------| -----------|
| 2022 – 2026              | БГУИР             | Инженер-системотехник | ФКП        |


## Пример кода на Java 💻

Кусочек кода на языке Java одной из курсовых:

```java
package com.university.coursework;

import Users.Cards;
import dbCards.dbHandler_Cards;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.control.Button;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import javax.swing.*;
import java.io.IOException;
import java.net.URL;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ResourceBundle;

public class MainMenu {

    @FXML
    private ResourceBundle resources;

    @FXML
    private URL location;

    @FXML
    private Button registerAdminButton_MainMenu;

    @FXML
    private TextField login_MainMenu;

    @FXML
    private PasswordField password_MainMenu;

    @FXML
    private Button registerButton_MainMenu;

    @FXML
    private Button singInButton_MainMenu;

    @FXML
    private Button SingInDoctorButton_MainMenu;

    @FXML
    void initialize() {
        singInButton_MainMenu.setOnAction(event -> handleLogin());
        registerAdminButton_MainMenu.setOnAction(event -> openNewScene("/com/university/coursework/SingUpAdmin.fxml"));
        registerButton_MainMenu.setOnAction(event -> openNewScene("/com/university/coursework/NewCard.fxml"));
        SingInDoctorButton_MainMenu.setOnAction(event -> openNewScene("/com/university/coursework/SingInDoctor.fxml"));
    }

    private void handleLogin() {
        String loginText = login_MainMenu.getText().trim();
        String loginPassword = password_MainMenu.getText().trim();

        if (!loginText.isEmpty() && !loginPassword.isEmpty()) {
            loginUser(loginText, loginPassword);
        } else {
            JOptionPane.showMessageDialog(null, "Поля логина и/или пароля не заполнены!");
           // System.out.println("Поля логина и/или пароля не заполнены!");
        }
    }

    private void loginUser(String loginText, String loginPassword) {
        dbHandler_Cards dbHandler = new dbHandler_Cards();
        Cards cards = new Cards();
        cards.setLogin(loginText);
        cards.setPassword(loginPassword);
        ResultSet result = dbHandler.getUser(cards);

        try {
            if (result.next()) { // Проверяем, есть ли результат
                // Если результат есть, значит логин и пароль верные
                openNewScene("/com/university/coursework/UserMenu.fxml");
            } else {
                // Если результата нет, значит логин или пароль неверны
                JOptionPane.showMessageDialog(null, "Неверный логин или пароль!");
            }
        } catch (SQLException e) {
            JOptionPane.showMessageDialog(null, "Ошибка при выполнении запроса к базе данных");
        }
    }

    private void openNewScene(String window) {
        Stage currentStage = (Stage) registerButton_MainMenu.getScene().getWindow(); // Получаем текущее окно

        FXMLLoader loader = new FXMLLoader(getClass().getResource(window));
        try {
            Parent root = loader.load();
            Stage newStage = new Stage();
            newStage.setScene(new Scene(root));
            newStage.show();
            currentStage.close(); // Закрываем текущее окно
        } catch (IOException e) {
           // throw new RuntimeException("Ошибка при загрузке сцены", e);
            JOptionPane.showMessageDialog(null, "Ошибка при загрузке окна");
        }
    }
}
```


## Всем добра 😇

![Немного Спанч Боба](https://github.com/Zhigalo04/Git/blob/main/EVT%20labs/Image.jpg)

---