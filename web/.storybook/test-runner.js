module.exports = {
  async preRender(page) {
    await page.addScriptTag({ content: 'window.scrollTo(0,0)' });
  },
  async postRender(page, context) {
    const results = await page.evaluate(async () => {
      return await axe.run();
    });
    if (results.violations.length) throw new Error('axe violations');
  }
};
