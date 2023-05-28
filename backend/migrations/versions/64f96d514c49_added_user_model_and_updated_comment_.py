"""Added User model and updated Comment model

Revision ID: 64f96d514c49
Revises: f6f506529a61
Create Date: 2023-05-25 01:38:32.339920

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "64f96d514c49"
down_revision = "f6f506529a61"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "user",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=16), nullable=False),
        sa.Column("email", sa.String(length=120), nullable=False),
        sa.Column("full_name", sa.String(length=64), nullable=True),
        sa.Column("registration_date", sa.DateTime(), nullable=True),
        sa.Column("last_active", sa.DateTime(), nullable=True),
        sa.Column("bio", sa.String(length=500), nullable=True),
        sa.Column("profile_picture", sa.String(length=200), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("username"),
    )
    op.create_table(
        "followers",
        sa.Column("follower_id", sa.Integer(), nullable=True),
        sa.Column("followed_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["followed_id"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["follower_id"],
            ["user.id"],
        ),
    )
    with op.batch_alter_table("comment", schema=None) as batch_op:
        batch_op.add_column(sa.Column("user_id", sa.Integer(), nullable=False))
        batch_op.create_foreign_key(None, "user", ["user_id"], ["id"])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("comment", schema=None) as batch_op:
        batch_op.drop_constraint(None, type_="foreignkey")
        batch_op.drop_column("user_id")

    op.drop_table("followers")
    op.drop_table("user")
    # ### end Alembic commands ###
