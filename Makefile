# bind 'make test' to the mocha binary requesting the 'spec' reporter
test-verbose:
		@./node_modules/.bin/mocha -R spec
.PHONY: test-verbose

test:
		@./node_modules/.bin/mocha -R nyan
.PHONY: test

