const axios=require("axios");
const xml2js=require("xml2js");
const MediumUsername="better-programming";
const RssfeedUrl=`https://medium.com/feed/${MediumUsername}`;

async function crawlMediumArticles(){
    console.log(`RSSfeed url: ${RssfeedUrl}`);
    try{
        
         
        const response=await axios.get(RssfeedUrl,{
            headers:{
                "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML,like Gecko)  Chrome/91.0.4472.124 Safari/537.36"
            }
        });

       const xmlData=response.data;
        const parser=new xml2js.Parser({explicitArray:false});
        const convertedData=await parser.parseStringPromise(xmlData);

        const articles=convertedData.rss.channel.item || [];

        const extractedarticles=articles.map(item=>({
            title:item.title,
            url: item.link.split("?")[0],
            author:item["dc:creator"],
            pubDate:new Date(item.pubDate).toLocaleDateString(),

        }));
        console.log(`Successfully extracted ${extractedarticles.length}`);

        extractedarticles.forEach((post,i)=>{
            console.log(`${i+1}. Title: ${post.title}`);
            console.log(` Author: ${post.author}`);
            console.log(` Published: ${post.pubDate}`);
            console.log(` Link: ${post.url}`);

        })
    }catch(error){
        console.log(`Error during crawling: ${error.message}`)
         console.log(`Check if the username  "@${MediumUsername} is correct or the feed Url is correct`)
    }
}
crawlMediumArticles();