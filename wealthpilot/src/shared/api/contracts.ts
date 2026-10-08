// Generated from the deployed Swagger contract. Monetary fields are integer paise.
export interface AccountInput {
  name: string | null;
  institution: string | null;
  type: string | null;
  openingBalancePaise: number;
  lastFour: string | null;
  color: string | null;
}
export interface AccountView {
  id: string | null;
  name: string | null;
  institution: string | null;
  type: string | null;
  balancePaise: number;
  lastFour: string | null;
  color: string | null;
}
export interface AuthView {
  token: string | null;
  fullName: string | null;
  username: string | null;
  recoveryCode: string | null;
  expiresAt: string;
}
export interface BudgetInput {
  categoryId: string | null;
  month: string | null;
  limitPaise: number;
}
export interface BudgetLimit {
  limitPaise: number;
}
export interface BudgetView {
  id: string | null;
  categoryId: string | null;
  month: string | null;
  limitPaise: number;
}
export interface CardBillInput {
  month: string | null;
  amountPaise: number;
  dueDate: string | null;
}
export interface CardBillView {
  id: string | null;
  cardId: string | null;
  month: string | null;
  amountPaise: number;
  paidPaise: number;
  dueDate: string;
}
export interface CardInput {
  accountId: string | null;
  name: string | null;
  issuer: string | null;
  network: string | null;
  type: string | null;
  lastFour: string | null;
  gradient: string | null;
  openingDebtPaise: number;
  limitPaise: number | null;
}
export interface CardRepaymentInput {
  paymentAccountId: string | null;
  amountPaise: number;
  date: string | null;
  billId: string | null;
}
export interface CardView {
  id: string | null;
  accountId: string | null;
  name: string | null;
  issuer: string | null;
  network: string | null;
  type: string | null;
  lastFour: string | null;
  gradient: string | null;
  balancePaise: number;
  limitPaise: number | null;
  duePaise: number | null;
  dueDate: string | null;
}
export interface CategoryInput {
  name: string | null;
  color: string | null;
  icon: string | null;
}
export interface CategorySpend {
  categoryId: string | null;
  amountPaise: number;
}
export interface CategoryTrendPoint {
  month: string | null;
  categories: Array<CategorySpend> | null;
}
export interface CategoryView {
  id: string | null;
  name: string | null;
  color: string | null;
  icon: string | null;
}
export interface CfoAction {
  label: string | null;
}
export interface CfoActionResult {
  kind: string | null;
  goal: GoalView;
  reminder: ReminderView;
}
export interface CfoCard {
  title: string | null;
}
export interface CfoHistoryItem {
  request: CfoRequest;
  response: CfoResponse;
  finalized: boolean;
}
export interface CfoHistoryItemPagedResult {
  items: Array<CfoHistoryItem> | null;
  total: number;
  page: number;
  pageSize: number;
}
export interface CfoQuickReply {
  id: string | null;
  label: string | null;
  message: string | null;
}
export interface CfoRequest {
  requestId: string | null;
  conversationId: string | null;
  message: string | null;
  replyId: string | null;
  purchase: PurchaseFacts;
  expectedAdditionalMonthlyIncomePaise: number | null;
}
export interface CfoResponse {
  id: string | null;
  conversationId: string | null;
  revision: number;
  state: string | null;
  text: string | null;
  createdAt: string;
  purchase: PurchaseFacts;
  snapshot: CfoSnapshot;
  quickReplies: Array<CfoQuickReply> | null;
  cards: Array<ImpactCard | LoanPlanCard | StrategyCard | RoiCard | SalaryCard> | null;
  actions: Array<SetGoalAction | ShowPayoffAction | RemindAction> | null;
  decision: FinancialDecision;
}
export interface CfoSnapshot {
  salaryPaise: number;
  liquidSavingsPaise: number;
  goalAllocationsPaise: number;
  emergencyFundPaise: number;
  emergencyTargetPaise: number;
  emergencyProgressPercent: number;
  activeLoanOutstandingPaise: number;
  creditCardDebtPaise: number;
  monthlyExpensesPaise: number;
  monthlySavingsPaise: number;
  monthlyGoalSavingsPaise: number;
}
export interface ChangePasswordInput {
  currentPassword: string | null;
  newPassword: string | null;
}
export interface ContributionInput {
  amountPaise: number;
}
export interface ContributionView {
  id: string | null;
  amountPaise: number;
  createdAt: string;
}
export interface DashboardView {
  summary: SummaryView;
  trends: Array<PeriodPoint> | null;
  categories: Array<CategorySpend> | null;
  paymentMethods: Array<CategorySpend> | null;
  recentTransactions: Array<TransactionView> | null;
  goals: Array<GoalView> | null;
}
export interface DebtTotalsView {
  monthlyEmiPaise: number;
  unpaidCardBillsPaise: number;
  activeLoanCount: number;
  unpaidCardBillCount: number;
}
export interface FinancialDecision {
  policyVersion: string | null;
  recommendation: string | null;
  unallocatedPaise: number;
  ownSavedPaise: number;
  monthlyDeficitPaise: number;
  buyNowFunded: boolean;
  emergencyImpacted: boolean;
  otherGoalsImpacted: boolean;
  waitMonths: number | null;
  recommendedBuyDate: string | null;
  goalDelays: Array<GoalDelay> | null;
  loans: Array<LoanForecast> | null;
  salaryTargetPaise: number;
  assumptions: Array<string> | null;
}
export interface GoalDelay {
  goalName: string | null;
  months: number;
}
export interface GoalInput {
  name: string | null;
  targetPaise: number;
  targetDate: string | null;
  imageUrl: string | null;
  icon: string | null;
  priority: string | null;
}
export interface GoalView {
  id: string | null;
  name: string | null;
  targetPaise: number;
  savedPaise: number;
  targetDate: string | null;
  imageUrl: string | null;
  icon: string | null;
  priority: string | null;
  status: string | null;
  createdAt: string;
  purchasedAt: string | null;
  achievementAnnounced: boolean;
}
export interface IdentityView {
  id: string | null;
  tenantId: string | null;
  username: string | null;
}
export interface ImpactCard {
  purchasePricePaise: number;
  unallocatedSavingsPaise: number;
  goalDelays: Array<GoalDelay> | null;
  emergencyLabel: string | null;
  emergencyTone: string | null;
  recommendedBuyDate: string | null;
  waitMonths: number | null;
  explanation: string | null;
}
export interface LoanForecast {
  name: string | null;
  outstandingPaise: number;
  emiPaise: number;
  extraPaise: number;
  monthlyPaymentPaise: number;
  months: number | null;
  payoffDate: string | null;
}
export interface LoanInput {
  name: string | null;
  lender: string | null;
  principalPaise: number;
  outstandingPaise: number;
  annualInterestRate: number;
  emiPaise: number;
  nextDueDate: string | null;
  remainingMonths: number;
  paymentAccountId: string | null;
}
export interface LoanPaymentInput {
  paymentAccountId: string | null;
  principalPaise: number;
  interestPaise: number;
  feesPaise: number;
  date: string | null;
  categoryId: string | null;
  advanceDueDate: boolean;
}
export interface LoanPlanCard {
  loans: Array<LoanForecast> | null;
  explanation: string | null;
}
export interface LoanView {
  id: string | null;
  name: string | null;
  lender: string | null;
  principalPaise: number;
  outstandingPaise: number;
  annualInterestRate: number;
  emiPaise: number;
  nextDueDate: string | null;
  remainingMonths: number;
  status: string | null;
  paymentAccountId: string | null;
}
export interface LoginInput {
  usernameOrEmail: string | null;
  password: string | null;
}
export interface NotificationView {
  id: string | null;
  kind: string | null;
  title: string | null;
  message: string | null;
  createdAt: string;
  read: boolean;
  href: string | null;
  sourceKey: string | null;
}
export interface NotificationViewPagedResult {
  items: Array<NotificationView> | null;
  total: number;
  page: number;
  pageSize: number;
}
export interface PeriodPoint {
  month: string | null;
  incomePaise: number;
  expensePaise: number;
  savingsPaise: number;
}
export interface PositionReconciliation {
  id: string | null;
  expectedPaise: number;
  actualPaise: number;
}
export interface ProfileInput {
  name: string | null;
  email: string | null;
  occupation: string | null;
  monthlySalaryPaise: number;
  monthlyGoalSavingsPaise: number;
  emergencyFundPaise: number;
  emergencyTargetPaise: number;
}
export interface ProfileView {
  id: string | null;
  name: string | null;
  email: string | null;
  occupation: string | null;
  monthlySalaryPaise: number;
  monthlyGoalSavingsPaise: number;
  emergencyFundPaise: number;
  emergencyTargetPaise: number;
  currency: string | null;
}
export interface PurchaseFacts {
  name: string | null;
  pricePaise: number;
  category: string | null;
}
export interface PurchaseInput {
  paymentAccountId: string | null;
}
export interface ReconciliationView {
  balanced: boolean;
  journalBalanced: boolean;
  accounts: Array<PositionReconciliation> | null;
  cards: Array<PositionReconciliation> | null;
  loans: Array<PositionReconciliation> | null;
}
export interface RecoveryInput {
  usernameOrEmail: string | null;
  recoveryCode: string | null;
  newPassword: string | null;
}
export interface RecoveryView {
  recoveryCode: string | null;
}
export interface RegisterInput {
  fullName: string | null;
  email: string | null;
  username: string | null;
  password: string | null;
}
export interface RemindAction {
  title: string | null;
  dueDate: string | null;
  idempotencyKey: string | null;
}
export interface ReminderInput {
  title: string | null;
  dueDate: string | null;
}
export interface ReminderView {
  id: string | null;
  title: string | null;
  dueDate: string | null;
  createdAt: string;
}
export interface RemovalView {
  id: string | null;
}
export interface ReportView {
  period: string | null;
  value: string | null;
  coverageFrom: string | null;
  coverageTo: string | null;
  incomePaise: number;
  expensePaise: number;
  savingsPaise: number;
  savingsRatePercent: number;
  trends: Array<PeriodPoint> | null;
  categories: Array<CategorySpend> | null;
  categoryTrends: Array<CategoryTrendPoint> | null;
}
export interface RoiCard {
  purchasePricePaise: number;
  potentialMonthlyIncomePaise: number;
  breakEvenMonths: number;
  explanation: string | null;
}
export interface SalaryCard {
  currentSalaryPaise: number;
  targetSalaryPaise: number;
  progressPercent: number;
  steps: Array<string> | null;
}
export interface SetGoalAction {
  goal: GoalInput;
  existingGoalId: string | null;
  idempotencyKey: string | null;
}
export interface ShowPayoffAction {
  message: string | null;
  replyId: string | null;
}
export interface StrategyCard {
  options: Array<StrategyOption> | null;
}
export interface StrategyOption {
  name: string | null;
  description: string | null;
  costPaise: number | null;
}
export interface SummaryView {
  tenantId: string | null;
  revision: number;
  asOf: string;
  month: string | null;
  liquidBalancePaise: number;
  investmentsPaise: number;
  creditCardDebtPaise: number;
  activeLoanOutstandingPaise: number;
  netWorthPaise: number;
  goalAllocationsPaise: number;
  emergencyFundPaise: number;
  emergencyTargetPaise: number;
  unallocatedSavingsPaise: number;
  actualMonthlyIncomePaise: number;
  actualMonthlyExpensesPaise: number;
  actualMonthlySavingsPaise: number;
  savingsRatePercent: number;
  planningSalaryPaise: number;
  monthlyGoalSavingsPaise: number;
  upcomingBills: Array<UpcomingBill> | null;
  debtTotals: DebtTotalsView;
}
export interface TransactionInput {
  amountPaise: number;
  type: string | null;
  categoryId: string | null;
  date: string | null;
  note: string | null;
  paymentMethodId: string | null;
  tags: Array<string> | null;
  destinationAccountId: string | null;
}
export interface TransactionView {
  id: string | null;
  amountPaise: number;
  type: string | null;
  categoryId: string | null;
  date: string | null;
  note: string | null;
  paymentMethodId: string | null;
  tags: Array<string> | null;
  destinationAccountId: string | null;
}
export interface TransactionViewPagedResult {
  items: Array<TransactionView> | null;
  total: number;
  page: number;
  pageSize: number;
}
export interface UpcomingBill {
  id: string | null;
  kind: string | null;
  name: string | null;
  dueDate: string | null;
  amountPaise: number;
}