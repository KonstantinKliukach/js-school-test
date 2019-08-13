class Task {
  constructor (container) {
    this.container = container
    this.correctAnswers = [1, 3]
    this.selectedAnswers = []
    this.variants = container.querySelectorAll('.variant')
    this.submit = container.querySelector('.submit')
    this.hints = container.querySelectorAll('.hint')
    this.registerEvents()
  }

  registerEvents() {
    [...this.variants].forEach(variant => {
      variant.addEventListener('click', this.selectAnswer.bind(this))
    });
    this.submit.addEventListener('click', this.submitTask.bind(this))
  }

  selectAnswer(e) {
    const variant = e.currentTarget
    if (variant.classList.contains('variant-default')) {
      variant.classList.remove('variant-default')
      variant.classList.add('variant-choosen')
      this.addOrRemoveAnswer(Number.parseInt(variant.dataset.variant))
      return
    }
    if (variant.classList.contains('variant-choosen')) {
      variant.classList.remove('variant-choosen')
      variant.classList.add('variant-default')
      this.addOrRemoveAnswer(Number.parseInt(variant.dataset.variant))
      return
    }
  }

  addOrRemoveAnswer(answer) {
    const index = this.selectedAnswers.indexOf(answer)
    if (index === -1) {
      this.selectedAnswers.push(answer)
    } else {
      this.selectedAnswers = [...this.selectedAnswers.slice(0, index), ...this.selectedAnswers.slice(index+1)]
    }
  }

  returnToDefault() {
    this.variants.forEach(variant => {
      variant.classList.remove('variant-mistake')
      variant.classList.remove('variant-choosen')
      variant.classList.add('variant-default')
      this.submit.classList.remove('submit-mistake')
      this.submit.classList.add('submit-disabled')
    })
  }

  removeTask() {
    this.container.remove()
  }

  submitTask() {
    this.selectedAnswers.forEach(answer => {
      /* Если есть ошибки */
      if (this.correctAnswers.indexOf(answer) === -1) {
        const variant = document.querySelectorAll(`[data-variant="${answer}"]`)[0]
        variant.classList.remove('variant-choosen')
        variant.classList.add('variant-mistake')

        this.submit.classList.remove('submit-default')
        this.submit.classList.add('submit-mistake')
        this.submit.disabled = true;

        setTimeout(this.returnToDefault.bind(this), 1000)

        /*Прячем одну */
        if (!this.hints[1].classList.contains('hint-hidden')) {
          this.hints[1].classList.add('hint-hidden')
        }
        /* Показываем другую */
        if (this.hints[0].classList.contains('hint-hidden')) {
          this.hints[0].classList.remove('hint-hidden')
        }
        return
      }
      /* Если не все отмечены */
      if (this.correctAnswers.length > this.selectedAnswers.length) {
        this.submit.classList.remove('submit-default')
        this.submit.classList.add('submit-mistake')
        this.submit.disabled = true;

        setTimeout(this.returnToDefault.bind(this), 1000)
        /*Прячем одну */
        if (!this.hints[0].classList.contains('hint-hidden')) {
          this.hints[0].classList.add('hint-hidden')
        }
        /* Показываем другую */
        if (this.hints[1].classList.contains('hint-hidden')) {
          this.hints[1].classList.remove('hint-hidden')
        }
        return
      }
      /* Осталось сравнить */
      this.selectedAnswers.sort()
      this.correctAnswers.sort()

      if (this.selectedAnswers.toString() === this.correctAnswers.toString()) {
        this.submit.classList.remove('submit-default')
        this.submit.classList.add('submit-сorrect')
        this.hints.forEach(hint => {
          hint.classList.add('hint-hidden')
        })
        setTimeout(this.removeTask.bind(this), 1500)
      }
    })
  }
}

const task = new Task(document.querySelector('.task'))
