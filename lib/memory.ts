import {Redis} from "@upstash/redis";
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

export type CompanionKey={
    companionName:string;
    modelName:string;
    userId:string;
}

export class MemoryManager{
    private static instance: MemoryManager;
    private history:Redis;
    private vectorDBClient:PineconeClient;

    public constructor(){
        this.history=Redis.fromEnv();
        this.vectorDBClient=new PineconeClient(
            {
                apiKey:process.env.PINECONE_API_KEY!
            }
        );
    }
    public async init(){
        if(this.vectorDBClient instanceof PineconeClient){
            
        }
    }
    public async vectorSearch(
        recentChatHistory:number[],
        companionFileName:string
    ){
        const pineconeClient=<PineconeClient>this.vectorDBClient;

        const pineconeIndex=pineconeClient.Index(process.env.PINECONE_INDEX!||"");

        const vectorStore=await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({openAIApiKey:process.env.OPEN_API_KEY}),
            {pineconeIndex}

        );


        const similarDocs=await vectorStore
        .similaritySearchVectorWithScore(recentChatHistory,2)
        .catch((err)=>{
            console.log("Failed to get vector search results",err);

        })
        return similarDocs;
    }
    // public static async getInstance():Promise<MemoryManager>{
    //     if(!MemoryManager.instance){

    //     }
    }
}
