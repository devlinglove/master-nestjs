import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  const dto = new CreateUserDto();

  beforeEach(() => {
    dto.email = 'test@test.com';
    dto.name = 'Umar';
    dto.password = '1234577A';
  });
  it('should-success-with-valid-data', async () => {
    //Act
    const errors = await validate(dto);
    //Assertion
    expect(errors.length).toBe(0);
  });
  it('should-fail-with-invalid-email', async () => {
    //Arrange
    dto.email = 'test';
    //Act
    const errors = await validate(dto);
    //Assertion
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  const testPassword = async (password: string, message: string) => {
    //Arrange
    dto.password = password;
    //Act
    const errors = await validate(dto);
    //Assertion
    const passError = errors.find((error) => error.property == 'password');
    expect(passError).not.toBeUndefined();
    const errorMessage = passError.constraints['matches'];
    expect(errorMessage).toContain(message);
  };

  it('should-contain-one-uppercase-password', async () => {
    await testPassword(
      'abcd123',
      'Password must contain at least 1 uppercase letter',
    );
  });
});
