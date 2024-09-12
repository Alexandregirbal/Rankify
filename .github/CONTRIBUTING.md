# Contributing to Rankify

## Who may contribute ?

- If you wish to be added as a collaborator, please send a message to @Alexandregirbal.
- Otherwise you can fork the repository and create a pull request with your changes.

## Contributing

When contributing to this repository, follow these steps:

1. Create an issue (make sure it doesn't already exist) to discuss the changes you wish to make. Add details and screenshots if necessary.

2. If you are a collaborator, you can directly assign yourself to the issue. and create a branch from the issue.

3. If you are not a collaborator, fork the repository and create a branch from the main branch following the naming convention `feature/issue_number-short_description` e.g. `feature/42-add-player-stats`

4. Make your changes and commit them to your branch as you would normally do.

5. Run a build locally to ensure your changes are working as expected. NextJS is pulling data from the database to build the static pages, so this step is important.

6. Run the tests locally to ensure you didn't break anything.

7. Create a pull request to the main branch.

8. Wait for the pull request to be reviewed and merged.


### Guidelines

There are no specific guidelines for contributing to this repository, you should only keep in mind the following:

- KISS: Keep it simple, stupid.

- Check at the code for examples of good practices.

- Learn NextJS basics (app router) to understand the difference between a server and a client component.

## Deployment

- The main branch is automatically deployed to Vercel. Only a repository admin can push directly to the main branch. All other changes should be made via a pull request.

- The production database is hosted on @Alexandregirbal's personal MongoDB Atlas account.
