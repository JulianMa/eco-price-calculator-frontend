import styles from './Home.module.css';
export default () => {
  return (
    <div>
      <p>Hello and welcome,</p>
      <p>
        I go by the nicknames of <i>Ucat</i> and <i>Fon</i> and i've been
        building this tool on my spare time. <br />
        This works hand in hand with a mod that outputs the data from the server
        that then this tool extracts to allow you to work with. More information
        on the mod can be found on the{' '}
        <a
          class="no-underline hover:underline text-textColor-success"
          target="_blank"
          href="https://mod.io/g/eco/m/live-data-exporter"
        >
          mod's page
        </a>
        . You can also contact me using discord, my handle is Fon#2880.
        <br />
        <br />
        Here's a brief explanation on current features:
      </p>
      <p>
        <b>Price calculator</b> page is where you can find all recipes in game
        and use them to figure out how much you should price your products in
        your store. No more excel or calculator, this tool does all those
        calculations for you. <br />
        Video tutorial here:{' '}
        <a
          class="no-underline hover:underline text-textColor-success"
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
          class="no-underline hover:underline text-textColor-success"
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
          class="no-underline hover:underline text-textColor-success"
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
        class="no-underline hover:underline text-textColor-success"
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
        <h3>3.5.0 (2023-09-09)</h3>
        <h4>Features</h4>
        <ul>
          <li>
            Added light and dark themes - preselects dark theme if enabled in
            operating system and can be customized by the user
          </li>
        </ul>
        <h3>3.4.1 (2023-08-07)</h3>
        <h4>Bugfix</h4>
        <ul>
          <li>Check for online servers on the backend</li>
        </ul>
        <h3>3.4.0 (2023-08-06)</h3>
        <h4>Features</h4>
        <ul>
          <li>Hide offline servers on server list</li>
          <li>Select first online server by default</li>
        </ul>
        <h4>Bugfix</h4>
        <ul>
          <li>Minor fix to error when offline server was selected</li>
        </ul>
      </div>
    </div>
  );
};
