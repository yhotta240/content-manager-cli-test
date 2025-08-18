function getBuildJob(buildDir: string, jekyll: boolean) {
  if (!jekyll) {
    return undefined;
  }

  return {
    'runs-on': 'ubuntu-latest',
    steps: [
      {
        name: 'Checkout',
        uses: 'actions/checkout@v4',
      },
      {
        name: 'Setup Ruby',
        uses: 'ruby/setup-ruby@v1',
        with: {
          'ruby-version': 3.2,
        },
      },
      {
        name: 'Install Jekyll',
        run: 'gem install jekyll',
      },
      {
        name: 'Prepare build directory',
        run: `mkdir build-root && mv ${buildDir} build-root/`,
      },
      {
        name: 'Build with Jekyll',
        uses: 'actions/jekyll-build-pages@v1',
        with: {
          source: 'build-root',
          destination: './_site',
        },
      },
      {
        name: 'Upload artifact',
        uses: 'actions/upload-pages-artifact@v3',
        with: {
          path: './_site',
        },
      },
    ],
  };
}

export { getBuildJob };