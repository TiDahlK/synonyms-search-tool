Cypress.Commands.add("addWord", (word) => {
  cy.get("span.arrow").then(($btn) => {
    if ($btn.hasClass("arrow--down")) {
      $btn.click();
    }
  });
  cy.get("div.autocomplete__input")
    .click()
    .type(word)
    .type("{enter}")
    .type("{selectall}{backspace}");
});
Cypress.Commands.add("searchForWord", (word) => {
  cy.get("div.autocomplete__search")
    .click()
    .type(word)
    .type("{enter}");
});
Cypress.Commands.add("clearSerach", (word) => {
  cy.get("div.autocomplete__search")
    .click()
    .type("{selectall}{backspace}");
});
Cypress.Commands.add("pressConfirmButton", () => {
  cy.get("a.button").click();
});
Cypress.Commands.add("addNewSet", (wordList) => {
  wordList.forEach((word) => {
    cy.addWord(word);
  });
  cy.pressConfirmButton();
});
Cypress.Commands.add("assertResultList", (wordList) => {
  wordList.forEach((currentWord, currentWordIndex) => {
    cy.searchForWord(currentWord);
    cy.assertResultTitle(currentWord);
    cy.assertResultListLength(wordList);
    cy.assertListItems(wordList, "search", currentWordIndex);
    cy.clearSerach();
  });
});
Cypress.Commands.add("assertListItems", (wordList, type, currentWordIndex) => {
  wordList.forEach((synonym, synonymsIndex) => {
    if (currentWordIndex !== synonymsIndex) {
      cy.get(`#${type}-result`)
        .children()
        .should("contain", synonym);
    }
  });
});
Cypress.Commands.add("assertResultTitle", (currentWord) => {
  cy.get("#result-title").should(
    "have.text",
    `"${currentWord}" is synonymous with`
  );
});
Cypress.Commands.add("assertResultListLength", (set) => {
  cy.get("#search-result")
    .children()
    .should("have.length", set.length - 1);
});
Cypress.Commands.add("removeWord", (word, type) => {
  cy.get(`#${type}-result-remove_${word}`).click();
});
Cypress.Commands.add("assertRemoved", (word, type) => {
  cy.searchForWord(word);
  cy.get(`#${type}-result`).should("not.exist");
});
Cypress.Commands.add("assertRemovedFromList", (word, type) => {
  cy.get(`#${type}-result`)
    .children()
    .should("not.contain", word);
});
