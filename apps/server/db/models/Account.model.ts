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
  tableName: 'account',
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
export class Account extends Model<
  InferAttributes<Account>,
  InferCreationAttributes<Account>
> {
  @Attribute(DataTypes.BIGINT)
  @PrimaryKey
  @AutoIncrement
  declare id: CreationOptional<bigint>;

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

  @BeforeCreate
  static async beforeCreateHook(userAccount: Account): Promise<void> {
    userAccount.email = userAccount.email.toLowerCase();
  }

  @BeforeUpdate
  static async beforeUpdateHook(userAccount: Account): Promise<void> {
    if (userAccount.previous('email') !== userAccount.email) {
      userAccount.email = userAccount.email.toLowerCase();
    }
  }
}

export type AccountAttributes = InferAttributes<Account>;
export type AccountCreationAttributes = InferCreationAttributes<Account>;

export default Account;