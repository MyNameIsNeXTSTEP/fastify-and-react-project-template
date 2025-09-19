import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from '@sequelize/core';
import {
  Attribute,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Unique,
  Table,
  BeforeCreate,
  BeforeUpdate,
  Default,
} from '@sequelize/core/decorators-legacy';

@Table({
  tableName: 'user_accounts',
  timestamps: true,
  underscored: true,
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
    {
      fields: ['is_active'],
    },
  ],
})
export class UserAccount extends Model<
  InferAttributes<UserAccount>,
  InferCreationAttributes<UserAccount>
> {
  @Attribute(DataTypes.INTEGER)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<number>;

  @Attribute(DataTypes.STRING(255))
  @NotNull
  declare email: string;

  @Attribute(DataTypes.STRING(255))
  declare password?: string;

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare firstName: string;

  @Attribute(DataTypes.STRING(100))
  @NotNull
  declare lastName: string;

  @Attribute(DataTypes.BOOLEAN)
  @NotNull
  @Default(true)
  declare isActive: boolean;

  @Attribute(DataTypes.DATE)
  declare lastLogin: Date | null;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare readonly createdAt: CreationOptional<Date>;

  @Attribute(DataTypes.DATE)
  @NotNull
  declare readonly updatedAt: CreationOptional<Date>;

  // Instance methods
  public getFullName(): string {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
  }

  public toJSON(): object {
    const values = Object.assign({}, this.dataValues);
    if (values.password) {
      delete (values as any).password;
    }
    return values;
  }

  // Hooks using decorators
  @BeforeCreate
  static async beforeCreateHook(userAccount: UserAccount): Promise<void> {
    userAccount.email = userAccount.email.toLowerCase();
  }

  @BeforeUpdate
  static async beforeUpdateHook(userAccount: UserAccount): Promise<void> {
    if (userAccount.previous('email') !== userAccount.email) {
      userAccount.email = userAccount.email.toLowerCase();
    }
  }
}

// Type exports for compatibility
export type UserAccountAttributes = InferAttributes<UserAccount>;
export type UserAccountCreationAttributes = InferCreationAttributes<UserAccount>;

export default UserAccount;