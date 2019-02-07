export function getLoop(template, startText, startEOLText, endText) {
  let startIndex = template.indexOf(startText, 0)
  let startIndexLineEnd = template.indexOf(startEOLText, startIndex)
  let endIndex = template.indexOf(endText, startIndexLineEnd)
  return {startIndex, startIndexLineEnd, endIndex}
}
