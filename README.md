### Scrapping and REST API Demo

Demo apps for scrapping [BCA Kurs data](https://www.bca.co.id/id/Individu/Sarana/Kurs-dan-Suku-Bunga/Kurs-dan-Kalkulator]) and serve it thru API using Node, MongoDB and expressJS.

##### Run the project.

```
$ docker-compose up --build
```

If you are having an issue that the API could not start because the database is not ready.

Run this command for restarting the apps.

```
$ docker-compose restart api
```

And here is how to run the test.

```
$ docker-compose exec api npm test
```