
const AmountFormatter = (amount: number) => {
  let formattedValue = new Intl.NumberFormat().format(amount)
  return formattedValue;
}

export default AmountFormatter