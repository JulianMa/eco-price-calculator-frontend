export default () => {
    return (
        <div>
            <h1 className={"text-3xl mb-3"}>Introduction</h1>
            <p>One of the most central and important parts of Eco is Trading. How should you safe the World, when you
                can't even figure out, how much you should charge for your Products? Getting your prices wrong, will
                often cause frustration: Either nobody wants to buy your stuff, or your
                shop is sold-out after a minute.</p>
            <p>This Guide will focus on how you can calculate competitive prices, while saving you a lot of
                headache.</p>

            <h1 className={"text-3xl mb-3 mt-3"}>Basics</h1>
            <h2 className={"text-2xl font-bold mb-3"}>Your currency</h2>
            <p>While there are some Servers with a global currency, most will start with nothing. But don't panic!
                That's not an issue at all! As soon as you place a Store, your own currency (named by your Username),
                will be created.
                This currency is not a typical currency you know: See it as a token, which tracks who bought stuff from
                your store and as a form of debt.
            </p>
            <p>
                This currency has no value by its own. So if you want to calculate Prices, you need to define how much
                your currency is worth.
            </p>
            <h2 className={"text-2xl font-bold mb-3 mt-3"}>Raw Resources</h2>
            <p>All Items you can craft in Eco, are refined by a number of raw resources. Those are all the items, you
                can directly harvest in the world.</p>
            <p>If you want to craft some Hewn Log, you need Logs, which you can harvest. If you want to craft some
                Lumber, you
                need Nails, which need Iron, which needs Iron Ore, which you can also Harvest in the World.</p>
            <p>When you want to know, for how much you should sell your crafted Lumber, you need to know how much those
                resources cost.</p>
            <p>And that price is totally up to you! My personal preference is, to charge 0.1 for Logs and 0.1 for
                Ores.</p>

            <h1 className={"text-3xl mb-3 mt-3"}>First steps</h1>
            <p>Open the Price Calculator Tab on top of the Page and select your currency in the dropdown on the right. It should be called "Your Username" Credit</p>
            <p>THIS IS WORK IN PROGRESS AND WILL BE COMPLETED AT A LATER STAGE</p>
        </div>
    );
};
