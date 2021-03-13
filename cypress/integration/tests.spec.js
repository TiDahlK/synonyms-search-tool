const firstSet = ["word_1", "word_2"];
const secondSet = ["word_3", "word_4"];
const thirdSet = ["word_5", "word_6"];

describe("Adding", () => {
  it("Can add new set", () => {
    cy.addNewSet(firstSet);
    cy.assertResultList(firstSet);
  });
  it("Can add word to existing set", () => {
    cy.addNewSet(firstSet);
    cy.searchForWord(firstSet[0]);
    cy.addWord(secondSet[0]);
    cy.pressConfirmButton();
    cy.clearSerach();
    cy.assertResultList([...firstSet, secondSet[0]]);
  });
  it("Can union two sets", () => {
    cy.addNewSet(firstSet);
    cy.assertResultList(firstSet);
    cy.addNewSet([...secondSet, firstSet[0]]);
    cy.assertResultList([...firstSet, ...secondSet]);
  });
  it("Can union more than two sets", () => {
    cy.addNewSet(firstSet);
    cy.assertResultList(firstSet);
    cy.addNewSet(secondSet);
    cy.assertResultList(secondSet);
    cy.addNewSet(thirdSet);
    cy.assertResultList(thirdSet);
    cy.addNewSet([secondSet[0], firstSet[0], thirdSet[0]]);
    cy.assertResultList([...firstSet, ...secondSet, ...thirdSet]);
  });
  it("Can not add new word twice", () => {
    cy.addWord(firstSet[0]);
    cy.addWord(firstSet[0]);
    cy.get("#input-result")
      .children()
      .should("have.length", 1);
  });
  it("Can not add word already in set", () => {
    cy.addNewSet(firstSet);
    cy.searchForWord(firstSet[0]);
    cy.addWord(firstSet[0]);
    cy.addWord(firstSet[1]);
    cy.get("#input-result").should("not.exist");
  });
});
describe("Removing", () => {
  it("Can remove word from set", () => {
    cy.addNewSet([...firstSet, ...secondSet]);
    cy.assertResultList([...firstSet, ...secondSet]);
    cy.searchForWord(firstSet[0]);
    cy.removeWord(firstSet[1], "search");
    cy.assertRemovedFromList(firstSet[1], "search");
    cy.clearSerach();
    cy.assertRemoved(firstSet[1], "search");
  });
  it("Can remove word before confirm input", () => {
    cy.addWord(firstSet[0]);
    cy.addWord(firstSet[1]);
    cy.addWord(secondSet[0]);
    cy.assertListItems([...firstSet, secondSet[0]], "input");
    cy.removeWord(secondSet[0], "input");
    cy.assertRemovedFromList(secondSet[0], "input");
  });
  it("Can remove set", () => {
    cy.addNewSet(firstSet);
    cy.assertResultList(firstSet);
    cy.searchForWord(firstSet[0]);
    cy.removeWord(firstSet[1], "search");
    cy.clearSerach();
    cy.assertRemoved(firstSet[1], "search");
    cy.clearSerach();
    cy.assertRemoved(firstSet[0], "search");
  });
});
