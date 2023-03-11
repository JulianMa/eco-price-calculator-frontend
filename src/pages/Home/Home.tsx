import styles from './Home.module.css';
export default () => {
  return (
    <div>
      <p>Hello and welcome,</p>
      <p>
        I go by the nicknames of <i>Ucat</i> and <i>Fon</i> and i've been
        building this tool on my spare time. You can contact me using discord,
        my handle is Fon#2880. Here's a brief explanation on current features:
      </p>
      <p>
        <b>Price calculator</b> page is where you can find all recipes in game
        and use them to figure out how much you should price your products in
        your store. No more excel or calculator, this tool does all those
        calculations for you. <br />
        Video tutorial here:{' '}
        <a
          class="no-underline hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          target="_blank"
          href="https://youtu.be/F3RWjCK5VcM"
        >
          https://youtu.be/F3RWjCK5VcM
        </a>
      </p>
      <p>
        <b>Ingame market</b> page is where you can check the products that are
        being sold at this moment in ingame stores. There are currently two
        views with different visibility level: one for stores and one for
        products. <br />
        Video tutorial here:{' '}
        <a
          class="no-underline hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          target="_blank"
          href="https://youtu.be/ZraPFAxvyjo"
        >
          https://youtu.be/ZraPFAxvyjo
        </a>
      </p>
      <p>
        <b>Raw data</b> page is where you can download the raw files i use on
        this tool to check raw data or to create your own tool.
        <br />
        Video tutorial here:{' '}
        <a
          class="no-underline hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
          target="_blank"
          href="https://youtu.be/sUkygO9QyOE"
        >
          https://youtu.be/sUkygO9QyOE
        </a>
      </p>
      <p>
        <b>Personal</b> page is where you can see and edit all the personal
        prices and other default values you used. The tool remembers your last
        choices so that you don't have to.
        <br />
      </p>
      <br />
      <br />
      <p>
        PS: I could really use the help of a UX designer to improve this tool.
        If you have the skills and are willing to help, please reach out to me
        over discord.{' '}
      </p>
      <br />
      If you like this tool and you wish to thank me for my efforts and/or you'd
      like to contribute to it's further development and maintenance consider{' '}
      <a
        class="no-underline hover:underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
        target="_blank"
        href="https://www.buymeacoffee.com/pricecalculator"
      >
        buying me a coffee
      </a>{' '}
      for inspiration in future coding sessions. Thanks for appreciating my
      efforts.
      <br />
      <br />
      <div class={styles.changelog}>
        <h2>Latest changes</h2>
        <h3>3.3.0 (2023-03-11)</h3>
        <h4>Features</h4>
        <ul>
          <li>Added click to copy calculation to clipboard</li>
        </ul>
        <h3>3.2.0 (2023-03-11)</h3>
        <h4>Features</h4>
        <ul>
          <li>Added the Personal page to list and set user personal prices</li>
        </ul>
      </div>
    </div>
  );
};
