# 📚 Book Recommendation System

Aplikacja webowa umożliwiająca zarządzanie kolekcją książek oraz otrzymywanie spersonalizowanych rekomendacji na podstawie preferencji użytkownika. Projekt został wykonany jako praca inżynierska i łączy elementy tworzenia aplikacji webowych oraz uczenia maszynowego.

## 🎯 Cel projektu

Celem projektu było stworzenie pełnoprawnej aplikacji webowej pozwalającej użytkownikom na przeglądanie, dodawanie oraz przechowywanie informacji o książkach, a także implementacja systemu rekomendacji wykorzystującego algorytmy uczenia maszynowego.

System rekomendacji analizuje dane dotyczące interakcji użytkowników z książkami i generuje spersonalizowane propozycje dopasowane do ich zainteresowań.

---

#  Funkcjonalności

## 📖 Zarządzanie książkami

* przeglądanie dostępnych książek,
* dodawanie nowych pozycji do bazy danych,
* przechowywanie informacji o książkach:

  * tytuł,
  * autor,
  * gatunek,
  * ocena.

## 👤 Użytkownicy

* obsługa profili użytkowników,
* przechowywanie historii interakcji,
* analiza preferencji użytkownika.

## 🤖 System rekomendacji

* generowanie spersonalizowanych rekomendacji książek,
* wykorzystanie modelu **LightFM**,
* zastosowanie metod filtrowania hybrydowego:

  * collaborative filtering,
  * content-based filtering.

Model wykorzystuje informacje o użytkownikach oraz cechy książek w celu znalezienia najbardziej dopasowanych rekomendacji.

---

# Architektura systemu

Aplikacja została zaprojektowana jako system typu full-stack składający się z:

```
Frontend
    ↓
Backend API
    ↓
Database
    ↓
Recommendation Model
```

### Frontend

Interfejs użytkownika został wykonany w technologii **React**, zapewniając dynamiczną i responsywną obsługę aplikacji.

### Backend

Warstwa serwerowa została napisana w języku **Python** i odpowiada za:

* logikę biznesową,
* komunikację z bazą danych,
* obsługę żądań użytkownika,
* integrację z modelem rekomendacji.

### Database

Dane aplikacji przechowywane są w relacyjnej bazie danych **PostgreSQL**.

Baza przechowuje między innymi:

* informacje o książkach,
* dane użytkowników,
* relacje użytkownik–książka,
* dane dotyczące ocen.

---

# Model rekomendacji

Do stworzenia systemu rekomendacji wykorzystano bibliotekę **LightFM**.

Model LightFM umożliwia połączenie dwóch podejść:

* **Collaborative Filtering**
  Analiza zachowań użytkowników i podobieństwa ich preferencji.

* **Content-Based Filtering**
  Wykorzystanie cech książek do znajdowania podobnych pozycji.

Dzięki temu system może rekomendować książki zarówno na podstawie wcześniejszych wyborów użytkownika, jak i charakterystyki książek.

---

# 🛠️ Technologie

## Frontend

* React
* JavaScript
* HTML
* CSS

## Backend

* Python
* REST API

## Machine Learning

* LightFM

## Database

* PostgreSQL

# Uruchomienie

Aby uruchomić program zapoznaj się z plikiem *instrukcja-uruchomienia.md*

# 👩‍💻 Autor

**Gabriela Myszkowiak**

Projekt inżynierski
Informatyka Stosowana
Politechnika Bydgoska im. Jana i Jędrzeja Śniadeckich
