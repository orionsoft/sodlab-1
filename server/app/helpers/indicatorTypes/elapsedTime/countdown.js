import countdown from 'countdown'

export function elapsedTime(date) {
  countdown.setLabels(
    ' milisegundo| segundo| minuto| hora| dia| semana| mes| año| década| siglo| milenio',
    ' milisegundos| segundos| minutos| horas| dias| semanas| meses| años| décadas| siglos| milenios',
    ' y ',
    ' + ',
    'ahora'
  )

  return countdown(
    date,
    null,
    countdown.MONTHS |
    countdown.WEEKS |
    countdown.DAYS |
    countdown.HOURS |
    countdown.MINUTES
  ).toString()
}