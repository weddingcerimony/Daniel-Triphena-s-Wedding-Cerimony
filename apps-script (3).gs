/**
 * VERIFICA INVITATI — Daniel & Tryphena
 * Aggiornato in base al foglio "Reception Check list"
 *
 * COLONNE DEL FOGLIO (così come le hai impostate):
 *   A: first name
 *   B: last name
 *   C: email
 *   D: Invitation        (es. "Accetto con gioia")
 *   E: Payed?             (yes / no)
 *   F: figli/bambini
 *   G: food restriction
 *
 * ISTRUZIONI:
 * 1. Nel tuo Google Sheet "Reception Check list" vai su
 *    Estensioni > Apps Script
 * 2. Cancella il contenuto di default e incolla questo intero file
 * 3. Controlla che SHEET_NAME qui sotto corrisponda esattamente
 *    al nome della tab in basso (nella tua foto è "Sheet1")
 * 4. Clicca "Distribuisci" > "Nuova distribuzione"
 *    - Tipo: Web app
 *    - Esegui come: Me
 *    - Chi ha accesso: Chiunque
 * 5. Copia l'URL che finisce con /exec
 * 6. Incollalo in verify.html al posto di "INCOLLA_QUI_URL_APPS_SCRIPT"
 *
 * Ogni volta che modifichi lo script devi ridistribuire
 * (Distribuisci > Gestisci distribuzioni > modifica > nuova versione).
 */

const SHEET_NAME = "Sheet1"; // cambia qui se la tua tab si chiama diversamente

// Indici delle colonne (0 = colonna A)
const COL_FIRST_NAME = 0; // A
const COL_LAST_NAME  = 1; // B
const COL_PAYED      = 4; // E

function doGet(e) {
  const nomeInput = (e.parameter.nome || "").trim().toLowerCase();
  const cognomeInput = (e.parameter.cognome || "").trim().toLowerCase();

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues(); // riga 0 = intestazioni

  let result = { status: "not_found" };

  for (let i = 1; i < data.length; i++) {
    const nome = String(data[i][COL_FIRST_NAME] || "").trim().toLowerCase();
    const cognome = String(data[i][COL_LAST_NAME] || "").trim().toLowerCase();

    if (nome === nomeInput && cognome === cognomeInput) {
      const payed = String(data[i][COL_PAYED] || "").trim().toLowerCase();

      if (payed === "yes" || payed === "si" || payed === "sì" || payed === "y") {
        result = { status: "confirmed" };
      } else {
        result = { status: "pending" };
      }
      break;
    }
  }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
