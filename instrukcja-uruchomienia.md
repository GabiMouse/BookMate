Do poprawnego działania systemu rekomendacji wymagane są wcześniej przygotowane pliki binarne, które są już dołączone do projektu:
* model.pkl – wytrenowany model LightFM

* dataset.pkl – obiekt Dataset zawierający mapowania użytkowników, książek i cech

* item_features.pkl – macierz cech książek

* features_map.pkl – mapowanie tagów/cech na indeksy modelu

Pliki te powinny znajdować się w katalogu */recommender/model*

Uruchomienie backendu:
* Należy przejść do katalogu backend
* Zainstalować zależności, np. za pomocą komendy: *pip install -r requirements.txt
* *
* Następnie utworzyć środowisko wirtualne
* Następnym krokiem jest uruchomienie serwera API komendą: *python main.py*

Backend będzie dostępny pod adresem: http://127.0.0.1:8000

Uruchomienie frontendu:
* Należy przejść do katalogu frontend
* Następnie zainstalować zależności komendą *npm install*
* Uruchomienie aplikacji następuje za pomocą komendy: *npm run dev*

Frontend będzie dostępny pod adresem: http://localhost:5173
