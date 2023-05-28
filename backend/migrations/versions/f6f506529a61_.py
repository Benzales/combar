"""empty message

Revision ID: f6f506529a61
Revises: 
Create Date: 2023-05-21 22:31:17.333055

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "f6f506529a61"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "url",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("url", sa.String(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("url"),
    )

    op.create_table(
        "comment",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("url_id", sa.Integer(), nullable=False),
        sa.Column(
            "path_to_common_ancestor",
            postgresql.JSON(astext_type=sa.Text()),
            nullable=False,
        ),
        sa.Column("start_offset", sa.Integer(), nullable=False),
        sa.Column("end_offset", sa.Integer(), nullable=False),
        sa.Column("comment_text", sa.String(), nullable=False),
        sa.Column("selected_text", sa.String(), nullable=False),
        sa.ForeignKeyConstraint(
            ["url_id"],
            ["url.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade():
    op.drop_table("comment")
    op.drop_table("url")