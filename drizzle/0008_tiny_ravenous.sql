ALTER TABLE "users" RENAME COLUMN "github_hashed_access_token" TO "github_access_token_hash";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "hashed_portfolio_url" TO "api_key_hash";