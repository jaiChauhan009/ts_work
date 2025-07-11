import { userData } from '../../assets/globalData';
import { AssertionEnum, RoutesEnum, WalletIDEnum } from '../../constants/enums';
describe('Send', () => {
  beforeEach(() => {
    cy.login(WalletIDEnum.unguardedWallet1, 'Send transaction');
  });
  afterEach(() => {
    cy.contains('Button', 'Close').click();
  });
  it('should successfully send a demo transaction', () => {
    cy.checkUrl(RoutesEnum.send);
    cy.getSelector('confirmData').should(AssertionEnum.contain, 'Hello_world');
    cy.getSelector('sendTrxBtn').click();
    cy.get('p')
      .should(AssertionEnum.contain, 'Sender')
      .should(
        AssertionEnum.contain,
        'drt16xlzk48ftvhxp8dyq6d0kkfpgpfechlzycfm9xmdmwna66pvkymq37z0p7'
      )
      .should(AssertionEnum.contain, 'Transaction status')
      .should(AssertionEnum.contain, 'succes');
  });

  it('should display the cancelled status', () => {
    cy.contains('Send transaction').click();
    cy.getSelector('accessPass').type(userData.passsword);
    cy.getSelector('submitButton').click();

    cy.getSelector('cancelTrxBtn').click();
    cy.get('p')
      .should(AssertionEnum.contain, 'Transaction status')
      .should(AssertionEnum.contain, 'cancelled');
  });
});
