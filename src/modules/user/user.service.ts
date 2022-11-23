import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { compareHashString, hashString } from 'src/common/utils/bcrypt';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { AuthCredentialsDto } from '@app/auth/dto/auth-credentials.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async saveUser(user: User) {
    return this.userRepository.save(user);
  }

  async updatePassword(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new ConflictException('User not found');
    }
    user.password = hashString(password);
    await this.userRepository.save(user);
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new ConflictException('User not found');
    }

    // delete null fields
    Object.keys(updateProfileDto).forEach(
      (key) => updateProfileDto[key] == null && delete updateProfileDto[key],
    );

    await this.userRepository.update(user.id, updateProfileDto);
  }

  async getMe(email: string) {
    const user = await this.userRepository.findOneBy({ email });
    if (user.password) {
      delete user.password;
    }
    return user;
  }

  async findOne(userInfo: { id?: number; email?: string }) {
    const { id, email } = userInfo;

    let user: User;
    if (id) {
      user = await this.userRepository.findOneBy({ id });
    }
    if (email) {
      user = await this.userRepository.findOneBy({ email });
    }

    return user;
  }

  async createOne(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { email, password } = authCredentialsDto;
    const existUser = await this.userRepository.findBy({ email });

    if (existUser.length) {
      throw new ConflictException('Email already exists');
    }

    const user = new User();
    user.email = email;
    user.password = hashString(password);

    await this.userRepository.insert(user);
  }

  async isValidCredential(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<boolean> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user || !user?.password) {
      throw new ConflictException('Invalid credentials');
    }

    return user && compareHashString(password, user.password);
  }
}
