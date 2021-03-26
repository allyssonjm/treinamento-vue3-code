import { validateEmptyAndLength3, validateEmptyAndEmail } from './validators'

describe('Validators utils', () => {
  it('Should give an error with enter payload', () => {
    expect(validateEmptyAndLength3()).toBe('*Este campo é obrigatório')
  })

  it('Should give on error with then 3 character payload', () => {
    expect(validateEmptyAndLength3('__')).toBe('*Este campo precisa no mínimo 3 caracteres')
  })

  it('should returns true when pass a correct param', () => {
    expect(validateEmptyAndLength3('___')).toBeTruthy()
  })

  it('should give on error with empty payload', () => {
    expect(validateEmptyAndEmail()).toBe('*Este campo é obrigatório')
  })

  it('should give on error with invalid email', () => {
    expect(validateEmptyAndEmail('fulano@test')).toBe('*Este campo precisa ser um e-mail')
  })

  it('should returns true when pass a valid email', () => {
    expect(validateEmptyAndEmail('fulano@test.net')).toBeTruthy()
  })
})
