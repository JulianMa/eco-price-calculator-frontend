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
      <br />
      <p>
        This is very much a work in progress and more sections should be added
        in the future.
      </p>
      <p>So stay tuned, and i hope you enjoy it</p>
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
        <h3>3.1.1 (2022-08-02)</h3>
        <h4>Bugfix</h4>
        <ul>
          <li>
            Fixed the formula for calculating the price based on margin.
            Previous formula was using markup instead of margin.
          </li>
        </ul>
        <h3>3.1.0 (2022-07-22)</h3>
        <h4>Features</h4>
        <ul>
          <li>
            Added simple view on calculator: It is meant as a simple way to
            calculate price with little to no input from the user (will be
            improved on future versions)
          </li>
          <li>
            Added fuel cost on expanded view as well as a modal that helps
            calculate it (can be set to 0 to ignore fuel costs)
          </li>
        </ul>
        <h3>3.0.1 (2022-05-22)</h3>
        <h4>Features</h4>
        <ul>
          <li>
            Removed dependency of a third party to keep json files exported from
            server. Server files are now exported to disk on same server that's
            running eco server. Price calculator accesses the files using the
            server web interface.
          </li>
          <li>Added buy me a coffee link on about page</li>
          <li>
            Added dropdown to select between multiple servers on main eco price
            calculator page
          </li>
          <li>Added config to only select a server when config is set</li>
        </ul>
      </div>
    </div>
  );
};
