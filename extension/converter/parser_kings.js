((APP_METHODS, HELPER_METHODS) => {
  const h = HELPER_METHODS()
  const a = APP_SETTING('archive')

  APP_METHODS.parserKings = {
    fetchUnconvertedHand: fetchUnconvertedHand,
    clickHand: clickHand,
    isFullscreenMask: isFullscreenMask,
    handleFullscreenMask: handleFullscreenMask,
    handleTimeout: handleTimeout,
    closeModal: closeModal,
    fetchUnconvertedHand_2: fetchUnconvertedHand_2
  }

  async function fetchUnconvertedHand_2(archiveHandElem, lag) {
    const result = {
      text: '',
      lines: [],
      error: null
    }
    archiveHandElem.dispatchEvent(a.clickEvent)
    let counter = 0
    while (!(textAreaDone(archiveHandElem))) {
      await h.delay(1)
      if (textAreaDone(archiveHandElem)) {
        handleResult(result)
        break
      }
      if ((counter % 100 === 0) && (counter !== 0)) {
        lag.innerHTML = `${counter/100}/${a.timeToDelay/100}`
      }
      if (counter > a.timeToDelay) {
        lag.innerHTML = `TIME OUT`
        handleTimeout(result, archiveHandElem)
        break
      }
      counter++
    }
    lag.innerHTML = '0/100'
    // for run #2
    if (!(result.text) && !(result.error)) {
      handleResult(result)
    }
    return result
  }

  function textAreaDone(archiveHandElem) {
    if (!($('textarea')) && !($('textarea')[0]) && !($('textarea')[0].value)) {
      console.error('Something went wrong with the textarea looping')
      return false
    }
    if (parseInt($('textarea')[0].value.slice(1,9)) !== parseInt(archiveHandElem.children[1].innerText)) {
      return false
    } 
    return true
  }

  function handleResult(result) {
    const text = $('textarea')[0].value.split('\n')
    for (const line of text) {
      result.lines.push(line)
      result.text += line+'\n'
    }
    result.error = false
  }






  async function fetchUnconvertedHand(archiveHandElem, lag) {
    const result = {
      text: '',
      lines: [],
      error: null
    }
    clickHand(archiveHandElem)
    let counter = 0
    while (!(isFullscreenMask())) {
      await h.delay(1)
      if (isFullscreenMask()) {
        handleFullscreenMask(result)
        closeModal()
        break
      }
      if ((counter % 100 === 0) && (counter !== 0)) {
        lag.innerHTML = `${counter/100}/${a.timeToDelay/100}`
      }
      if (counter > a.timeToDelay) {
        lag.innerHTML = `TIME OUT`
        handleTimeout(result, archiveHandElem)
        closeModal()
        break
      }
      counter++
    }
    lag.innerHTML = '0/100'
    return result
  }

  // Double clicks the hand
  function clickHand(elem) {
    elem.dispatchEvent(a.clickEvent)
    elem.dispatchEvent(a.doubleClickEvent)
  }

  // Checks if last element of body is appended with the fullscreen mask div
  function isFullscreenMask() {
    if (!($('body') && $('body')[0] && $('body')[0].lastElementChild)) {
      console.error('Something went wrong with the fullscreen mask looping')
      return false
    }
    return $('body')[0].lastElementChild.className === 'fullscreen_mask'
  }

  // populate result with hand
  function handleFullscreenMask(result) {
    const hhElem = h.getUnreadyElem(['.style_modal_dialog', '.style_hh_list'])[0].children
    for (const line of hhElem) {
      result.lines.push(line.innerText)
      result.text += line.innerText+'\n'
    }
    result.error = false
  }

  // Populate result with archive details
  function handleTimeout(result, elem) {
    result.error = true
    result.text += elem.innerText
  }

  // clicks close button in modal screen
  // TODO: error handling if button does not exist
  function closeModal() {
    const buttonElems = h.getUnreadyElem(['.style_modal_dialog', '.style_button_bar'])
    const button = buttonElems[0].lastElementChild
    if (!(button)) {
      return console.error('BUTTON DOES NOT EXIST!')
    }
    button.click()
  }
})(APP_METHODS, HELPER_METHODS)
