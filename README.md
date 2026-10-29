# Knižná búdka

Mapa knižných búdok. Používatelia môžu navrhnúť novú búdku cez tlačidlo **Pridať búdku**. Súradnice sa dajú načítať z GPS alebo vyplniť ručne.

## Ako odoslať návrh

1. Otvor aplikáciu cez HTTPS v Safari alebo Chrome a povoľ prístup k polohe, ak chceš použiť GPS.
2. Klikni na **Pridať búdku**, zadaj názov a použi **Pridať búdku z mojej polohy**, alebo zadaj zemepisnú šírku a dĺžku ručne.
3. Skontroluj súradnice a klikni na **Odoslať návrh na kontrolu**.
4. GitHub otvorí predvyplnený návrh. Prihlás sa do GitHubu, skontroluj údaje a klikni na **Submit new issue**.

GPS je voliteľné. Manuálne zadané súradnice fungujú aj vtedy, keď prehliadač polohu nepovolí. Odoslaný návrh sa nezobrazí v spoločnej mape automaticky; správca ho najprv overí.

## Ako schváliť a zverejniť návrh

1. V repozitári skontroluj návrh v **Issues** a over, že súradnice patria danej búdke.
2. V súbore `budky.json` pridaj objekt s novým jedinečným `id`, názvom a súradnicami. Formát objektu:

   ```json
   {
     "id": 123,
     "nazov": "Názov búdky",
     "lat": 48.1486,
     "lng": 17.1077
   }
   ```

3. Ulož zmenu a odošli commit do vetvy `main`. GitHub Pages potom zverejní aktualizovanú mapu.
4. Zavri Issue po nasadení.

## Súbory návrhov

- `index.html` obsahuje formulár a vysvetlenie odoslania.
- `app.js` získa polohu alebo prevezme ručne zadané súradnice a vytvorí predvyplnený GitHub Issue.
- `.github/ISSUE_TEMPLATE/navrh-budky.md` definuje šablónu návrhu na GitHube.
- `budky.json` obsahuje schválené búdky zobrazené všetkým používateľom.

Aby odosielanie fungovalo, v nastaveniach repozitára musí byť zapnutá funkcia **Issues**. Na vytvorenie Issue potrebuje používateľ GitHub účet. Toto statické GitHub Pages nasadenie neprijíma návrhy priamo do `budky.json`; na automatické zverejňovanie by bol potrebný backend alebo bezpečne nastavená služba na spracovanie formulárov.
