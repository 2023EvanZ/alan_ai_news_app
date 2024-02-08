import React, { useState, useEffect, useRef } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';

import wordsToNumbers from 'words-to-numbers';

import NewsCards from './components/NewsCards/NewsCards';
import useStyles from './styles.js';

const alanKey = 'c5835f848b6cfa3d2c04ab5d652de59c2e956eca572e1d8b807a3e2338fdd0dc/stage';

//import { NativeEventEmitter, NativeModules } from 'react-native';

const App = () => {
    const [ newsArticles, setNewsArticles ] = useState([]);
    const [ activeArticle, setActiveArticle ] = useState(0);
    const classes = useStyles();

    const alanBtnRef = useRef({}).current;
    //const { AlanEventEmitter } = NativeModules;
    //const alanEventEmitter = new NativeEventEmitter(AlanEventEmitter);


    useEffect(()=> {
        //alanBtn({
            alanBtnRef.btnInstance = alanBtn({
                key: alanKey,
                onCommand: ({ command, articles, number }) => {
                    if(command === 'newHeadlines') {
                        setNewsArticles(articles);
                        setActiveArticle(-1);
                    } else if (command === 'highlight') {
                        setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
                    } else if (command === 'open') {
                        const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
                        const article = articles[parsedNumber - 1];

                        if (parsedNumber > 20) {
                            alanBtnRef.btnInstance.playText('Please try that agin. Make sure to say a number less than 20.');
                        } else if (article) {
                            window.open(article.url, '_blank');
                            alanBtnRef.btnInstance.playText('Opening...');
                        } else {
                            alanBtnRef.btnInstance.playText('Please try that again...');
                        }
                    }
                },
            });
    }, []);

    return (
        <div>
            <div className={classes.logoContainer}>
                <img src="https://voicebot.ai/wp-content/uploads/2019/10/alan.jpg" alt="Alan AI Logo" className={classes.alanLogo} />
            </div>
            <NewsCards articles={newsArticles} activeArticle={activeArticle}/>
        </div>
    );
};

export default App;